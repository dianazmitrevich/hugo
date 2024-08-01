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
const SNAP_RADIUS = 20;
const LINE_COLORS = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33A1"];

const VerletSimulation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
    const activePointIndexRef = useRef<number | null>(activePointIndex);
    const linesRef = useRef<{ particles: Particle[]; segment: any; color: string }[]>([]);
    const activeLineIndexRef = useRef<number | null>(null);
    const [gridPoints, setGridPoints] = useState<GridPoint[]>([]);
    const [hoveredPoint, setHoveredPoint] = useState<GridPoint | null>(null);
    const availablePointsRef = useRef<GridPoint[]>([]);
    const previousPointRef = useRef<Vec2 | null>(null);

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

                return createLine(start.x, start.y, end.x, end.y, Math.floor(Math.random() * 10) + 10);
            };

            const createLine = (startX: number, startY: number, endX: number, endY: number, numPoints: number) => {
                const points = [];
                for (let i = 0; i < numPoints; i++) {
                    const t = i / (numPoints - 1);
                    const x = startX + t * (endX - startX);
                    const y = startY + t * (endY - startY);
                    points.push(new Vec2(x, y));
                }

                const segment = sim.lineSegments(points, 0.65);
                segment.pin(0);
                segment.pin(points.length - 1);

                return segment;
            };

            const updateLine = (lineIndex: number) => {
                const line = linesRef.current[lineIndex];
                if (line) {
                    const start = line.particles[0];
                    const end = line.particles[line.particles.length - 1];

                    line.segment = createLine(
                        start.pos.x,
                        start.pos.y,
                        end.pos.x,
                        end.pos.y,
                        line.segment.particles.length
                    );
                }
            };

            availablePointsRef.current = [...gridPoints];

            const shuffleArray = (array: any[]) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };

            const shuffledColors = shuffleArray([...LINE_COLORS]);

            const uniqueColors = shuffledColors.slice(0, 3);

            linesRef.current = [
                {
                    segment: createRandomLine(),
                    particles: [],
                    color: uniqueColors[0],
                },
                {
                    segment: createRandomLine(),
                    particles: [],
                    color: uniqueColors[1],
                },
                {
                    segment: createRandomLine(),
                    particles: [],
                    color: uniqueColors[2],
                },
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
                        const { x, y, sizeX, sizeY } = point;
                        return (
                            mouseX >= x - sizeX / 2 &&
                            mouseX <= x + sizeX / 2 &&
                            mouseY >= y - sizeY / 2 &&
                            mouseY <= y + sizeY / 2
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

            const getGridPointCenter = (point: GridPoint): { x: number; y: number } => {
                return { x: point.x, y: point.y };
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

            const handleMouseUp = (e: MouseEvent) => {
                const activePointIndex = activePointIndexRef.current;
                const activeLineIndex = activeLineIndexRef.current;

                if (activePointIndex !== null && activeLineIndex !== null) {
                    const line = linesRef.current[activeLineIndex];
                    if (line) {
                        const activePoint = line.particles[activePointIndex];
                        if (activePoint) {
                            const { x: mouseX, y: mouseY } = getMousePosition(e);

                            const pointUnderMouse = isMouseOverGridPoint(mouseX, mouseY);
                            const previousPoint = previousPointRef.current;

                            if (pointUnderMouse) {
                                const { x: gridX, y: gridY } = getGridPointCenter(pointUnderMouse);

                                if (
                                    availablePointsRef.current.some(
                                        (point) => point.x === pointUnderMouse.x && point.y === pointUnderMouse.y
                                    )
                                ) {
                                    activePoint.pos.x = gridX;
                                    activePoint.pos.y = gridY;

                                    if (previousPoint) {
                                        availablePointsRef.current.push({
                                            x: previousPoint.x,
                                            y: previousPoint.y,
                                            size: POINT_RADIUS,
                                            sizeX: POINT_RADIUS,
                                            sizeY: POINT_RADIUS,
                                        });

                                        availablePointsRef.current = availablePointsRef.current.filter(
                                            (point) => !(point.x === pointUnderMouse.x && point.y === pointUnderMouse.y)
                                        );
                                    }

                                    updateLine(activeLineIndex);
                                    setHoveredPoint(pointUnderMouse);
                                } else {
                                    if (previousPoint) {
                                        activePoint.pos.x = previousPoint.x;
                                        activePoint.pos.y = previousPoint.y;
                                        updateLine(activeLineIndex);
                                    }
                                }
                            } else {
                                if (previousPoint) {
                                    activePoint.pos.x = previousPoint.x;
                                    activePoint.pos.y = previousPoint.y;
                                    updateLine(activeLineIndex);
                                }
                            }

                            setActivePointIndex(null);
                            activePointIndexRef.current = null;
                            activeLineIndexRef.current = null;
                        }
                    }
                }
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

                                previousPointRef.current = {
                                    x: closestParticle.pos.x,
                                    y: closestParticle.pos.y,
                                };
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
                    context.strokeStyle = line.color;
                    context.lineJoin = "round";
                    context.lineCap = "round";
                    context.lineWidth = 60;
                    context.beginPath();

                    const linePoints: Particle[] = line.segment.particles;

                    linePoints.forEach((point: Particle, index: number) => {
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
