import React, { useEffect, useRef, useState } from "react";
import GridWithPoints, { GridPoint } from "./GridWithPoints";

type Vec2 = {
    x: number;
    y: number;
};

type Particle = {
    pos: Vec2;
    lastPos: Vec2;
};

const POINT_RADIUS = 10;
const SNAP_RADIUS = 10;

const VerletSimulation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
    const activePointIndexRef = useRef<number | null>(activePointIndex);
    const linesRef = useRef<{ particles: Particle[]; segment: any }[]>([]);
    const activeLineIndexRef = useRef<number | null>(null);
    const [gridPoints, setGridPoints] = useState<GridPoint[]>([]);
    const [hoveredPoint, setHoveredPoint] = useState<GridPoint | null>(null);
    const availablePointsRef = useRef<GridPoint[]>([]);

    useEffect(() => {
        activePointIndexRef.current = activePointIndex;
    }, [activePointIndex]);

    useEffect(() => {
        const handleResize = () => {
            if (!canvasRef.current || gridPoints.length === 0) return;

            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            if (!context) return;

            const width = window.innerWidth;
            const height = window.innerHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            context.scale(dpr, dpr);

            const { VerletJS, Vec2 } = window as any;

            const sim = new VerletJS(width, height, canvas);
            sim.gravity = new Vec2(0, 1);
            sim.friction = 0.95;

            const createRandomLine = () => {
                if (availablePointsRef.current.length < 2) {
                    console.warn("Not enough points available to create a line.");
                    return null;
                }

                let randomIndex1: number, randomIndex2: number;
                let start: GridPoint, end: GridPoint;

                do {
                    randomIndex1 = Math.floor(Math.random() * availablePointsRef.current.length);
                    start = availablePointsRef.current[randomIndex1];

                    randomIndex2 = Math.floor(Math.random() * availablePointsRef.current.length);
                    end = availablePointsRef.current[randomIndex2];
                } while (start === end);

                availablePointsRef.current = availablePointsRef.current.filter(
                    (point) => point !== start && point !== end
                );

                return createLine(start.x, start.y, end.x, end.y, Math.floor(Math.random() * 5) + 5);
            };

            const createLine = (startX: number, startY: number, endX: number, endY: number, numPoints: number) => {
                const points = [];
                for (let i = 0; i < numPoints; i++) {
                    const t = i / (numPoints - 1);
                    const x = startX + t * (endX - startX);
                    const y = startY + t * (endY - startY);
                    points.push(new Vec2(x, y));
                }

                const segment = sim.lineSegments(points, 0.15);
                segment.pin(0);
                segment.pin(points.length - 1);

                return segment;
            };

            availablePointsRef.current = [...gridPoints];

            linesRef.current = [
                { segment: createRandomLine(), particles: [] },
                { segment: createRandomLine(), particles: [] },
                { segment: createRandomLine(), particles: [] },
            ].filter((line) => line.segment !== null);

            const updateParticles = () => {
                linesRef.current.forEach((line) => {
                    line.particles = line.segment.particles.map((p: Particle) => ({
                        pos: { x: p.pos.x, y: p.pos.y },
                        lastPos: { x: p.lastPos.x, y: p.lastPos.y },
                    }));
                });
            };

            const isMouseOverGridPoint = (mouseX: number, mouseY: number): GridPoint | null => {
                return (
                    gridPoints.find((point) => {
                        const { x, y, size } = point;
                        return (
                            mouseX >= x - size / 2 &&
                            mouseX <= x + size / 2 &&
                            mouseY >= y - size / 2 &&
                            mouseY <= y + size / 2
                        );
                    }) || null
                );
            };

            const getMousePosition = (e: MouseEvent): { x: number; y: number } => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                return { x, y };
            };

            const handleMouseMove = (e: MouseEvent) => {
                const { x: mouseX, y: mouseY } = getMousePosition(e);

                const activePointIndex = activePointIndexRef.current;
                const activeLineIndex = activeLineIndexRef.current;

                if (activePointIndex !== null && activeLineIndex !== null) {
                    const line = linesRef.current[activeLineIndex];
                    if (line) {
                        const activePoint = line.particles[activePointIndex];
                        if (activePoint) {
                            activePoint.pos.x = mouseX;
                            activePoint.pos.y = mouseY;

                            if (
                                activePointIndex === 0 ||
                                activePointIndex === linesRef.current[activeLineIndex].particles.length - 1
                            ) {
                                const pointUnderMouse = isMouseOverGridPoint(mouseX, mouseY);
                                if (pointUnderMouse) {
                                    setHoveredPoint(pointUnderMouse);
                                } else {
                                    setHoveredPoint(null);
                                }
                            }
                        }
                    }
                } else {
                    setHoveredPoint(null);
                }
            };

            const handleMouseUp = () => {
                setActivePointIndex(null);
                activePointIndexRef.current = null;
                activeLineIndexRef.current = null;
            };

            const findClosestParticle = (mouseX: number, mouseY: number): Particle | null => {
                let closestParticle: Particle | null = null;
                let minDistance = SNAP_RADIUS;

                linesRef.current.forEach((line) => {
                    line.particles.forEach((particle) => {
                        const dx = mouseX - particle.pos.x;
                        const dy = mouseY - particle.pos.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < minDistance) {
                            minDistance = distance;
                            closestParticle = particle;
                        }
                    });
                });

                return closestParticle;
            };

            const handleMouseDown = (e: MouseEvent) => {
                const { x: mouseX, y: mouseY } = getMousePosition(e);

                const closestParticle = findClosestParticle(mouseX, mouseY);

                if (closestParticle) {
                    const lineIndex = linesRef.current.findIndex((line) => line.particles.includes(closestParticle));
                    if (lineIndex !== -1) {
                        const index = linesRef.current[lineIndex].particles.indexOf(closestParticle);

                        if (index === 0 || index === linesRef.current[lineIndex].particles.length - 1) {
                            if (activeLineIndexRef.current !== lineIndex || activePointIndexRef.current !== index) {
                                setActivePointIndex(index);
                                activePointIndexRef.current = index;
                                activeLineIndexRef.current = lineIndex;
                            }
                        }
                    }
                }
            };

            const loop = () => {
                sim.frame(16);
                context.clearRect(0, 0, width, height);

                linesRef.current.forEach((line) => {
                    context.strokeStyle = "red";
                    context.lineWidth = 30;
                    context.beginPath();
                    const linePoints = line.particles;
                    linePoints.forEach((point, index) => {
                        if (index === 0) {
                            context.moveTo(point.pos.x, point.pos.y);
                        } else {
                            context.lineTo(point.pos.x, point.pos.y);
                        }
                    });
                    context.stroke();
                });

                updateParticles();

                requestAnimationFrame(loop);
            };

            canvas.addEventListener("mousemove", handleMouseMove);
            canvas.addEventListener("mouseup", handleMouseUp);
            canvas.addEventListener("mousedown", handleMouseDown);

            loop();
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [gridPoints]);

    return (
        <div>
            <GridWithPoints onPointsReady={setGridPoints} hoveredPoint={hoveredPoint} />
            <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />
        </div>
    );
};

export default VerletSimulation;
