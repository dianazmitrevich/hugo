import React, { useEffect, useState } from "react";
import "./GridWithPoints.css";

const GRID_SIZE = 4;
const POINT_RADIUS = 20;

export type GridPoint = {
    x: number;
    y: number;
};

const GridWithPoints: React.FC<{ onPointsReady?: (points: GridPoint[]) => void }> = ({ onPointsReady }) => {
    const [gridPoints, setGridPoints] = useState<GridPoint[]>([]);

    useEffect(() => {
        const updateGridPoints = () => {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

            const points: GridPoint[] = [];
            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    points.push({
                        x: ((i + 0.5) * canvasWidth) / GRID_SIZE,
                        y: ((j + 0.5) * canvasHeight) / GRID_SIZE,
                    });
                }
            }
            setGridPoints(points);
            if (onPointsReady) {
                onPointsReady(points);
            }
        };

        updateGridPoints();
        window.addEventListener("resize", updateGridPoints);

        return () => {
            window.removeEventListener("resize", updateGridPoints);
        };
    }, [onPointsReady]);

    return (
        <div className="dots__container">
            {gridPoints.map((point, index) => (
                <div
                    key={index}
                    style={{
                        position: "absolute",
                        left: point.x - POINT_RADIUS,
                        top: point.y - POINT_RADIUS,
                        width: POINT_RADIUS * 2,
                        height: POINT_RADIUS * 2,
                        borderRadius: "50%",
                        backgroundColor: "blue",
                    }}
                    className="dot"
                />
            ))}
        </div>
    );
};

export default GridWithPoints;
