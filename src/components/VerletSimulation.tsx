import React, { useEffect, useRef, useState } from "react";

type Vec2 = {
    x: number;
    y: number;
};

type Particle = {
    pos: Vec2;
    lastPos: Vec2;
};

const SNAP_RADIUS = 20;

const VerletSimulation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
    const activePointIndexRef = useRef<number | null>(activePointIndex);
    const linePointsRef = useRef<Particle[]>([]);

    useEffect(() => {
        activePointIndexRef.current = activePointIndex;
    }, [activePointIndex]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        const { VerletJS, Vec2 } = window as any;

        const width = 800;
        const height = 800;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        context.scale(dpr, dpr);

        const sim = new VerletJS(width, height, canvas);
        sim.gravity = new Vec2(0, 1);
        sim.friction = 0.95;

        const points = [];
        const numPoints = 10;
        const lineLength = 10;
        const startX = 100;
        const startY = 300;

        for (let i = 0; i < numPoints; i++) {
            points.push(new Vec2(startX + (lineLength / (numPoints - 1)) * i, startY));
        }

        const segment = sim.lineSegments(points, 0.15);

        segment.pin(0);
        segment.pin(points.length - 1);

        linePointsRef.current = segment.particles.map((p: Particle) => ({
            pos: { x: p.pos.x, y: p.pos.y },
            lastPos: { x: p.lastPos.x, y: p.lastPos.y },
        }));

        const findClosestPoint = (mouseX: number, mouseY: number): Particle | null => {
            let closestPoint: Particle | null = null;
            let minDistance = SNAP_RADIUS;

            linePointsRef.current = segment.particles.map((p: Particle) => ({
                pos: { x: p.pos.x, y: p.pos.y },
                lastPos: { x: p.lastPos.x, y: p.lastPos.y },
            }));

            const linePoints = linePointsRef.current;
            linePoints.forEach((point) => {
                const dx = mouseX - point.pos.x;
                const dy = mouseY - point.pos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = point;
                }
            });

            return closestPoint;
        };

        const getMousePosition = (e: MouseEvent): { x: number; y: number } => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            return { x, y };
        };

        const handleMouseMove = (e: MouseEvent) => {
            const { x: mouseX, y: mouseY } = getMousePosition(e);

            if (activePointIndexRef.current !== null) {
                const linePoints = linePointsRef.current;
                const activePoint = linePoints[activePointIndexRef.current];
                activePoint.pos.x = mouseX;
                activePoint.pos.y = mouseY;
            }
        };

        const handleMouseUp = () => {
            setActivePointIndex(null);
        };

        const handleMouseDown = (e: MouseEvent) => {
            const { x: mouseX, y: mouseY } = getMousePosition(e);

            const closestPoint = findClosestPoint(mouseX, mouseY);

            if (closestPoint) {
                const index = linePointsRef.current.indexOf(closestPoint);
                if (index === 0 || index === linePointsRef.current.length - 1) {
                    setActivePointIndex(index);
                }
            }
        };

        const loop = () => {
            sim.frame(16);
            context.clearRect(0, 0, width, height);

            context.strokeStyle = "red";
            context.lineWidth = 10;
            context.beginPath();
            const linePoints = linePointsRef.current;
            linePoints.forEach((point, index) => {
                if (index === 0) {
                    context.moveTo(point.pos.x, point.pos.y);
                } else {
                    context.lineTo(point.pos.x, point.pos.y);
                }
            });
            context.stroke();

            linePointsRef.current = segment.particles.map((p: Particle) => ({
                pos: { x: p.pos.x, y: p.pos.y },
                lastPos: { x: p.lastPos.x, y: p.lastPos.y },
            }));

            requestAnimationFrame(loop);
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousedown", handleMouseDown);

        loop();

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    return (
        <div style={{ position: "relative", width: 800, height: 800 }}>
            <canvas ref={canvasRef} style={{ width: 800, height: 800 }} />
        </div>
    );
};

export default VerletSimulation;
