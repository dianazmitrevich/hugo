import React, { useEffect, useState } from "react";
import "./GridWithPoints.css";

const GRID_COLS = 4;
const GRID_ROWS = 3;
const GRID_GAP = 10;
var POINT_RADIUS = 1;

export type GridPoint = {
    x: number;
    y: number;
    isHighlighted?: boolean;
};

const GridWithPoints: React.FC<{ onPointsReady?: (points: GridPoint[]) => void }> = ({ onPointsReady }) => {
    const [gridPoints, setGridPoints] = useState<GridPoint[]>([]);

    useEffect(() => {
        const updateGridPoints = () => {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;
            POINT_RADIUS = (canvasWidth - (GRID_COLS - 1) * GRID_GAP) / GRID_COLS / 2;

            const points: GridPoint[] = [];
            for (let i = 0; i < GRID_COLS; i++) {
                for (let j = 0; j < GRID_ROWS; j++) {
                    points.push({
                        x: ((i + 0.5) * canvasWidth) / GRID_COLS,
                        y: ((j + 0.5) * canvasHeight) / GRID_COLS,
                        isHighlighted: false,
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
                        top: point.y - POINT_RADIUS + GRID_GAP * (index % GRID_ROWS),
                        width: POINT_RADIUS * 2,
                        height: POINT_RADIUS * 2,
                        backgroundColor: point.isHighlighted ? "green" : "blue",
                    }}
                    className="dot"
                />
            ))}
        </div>
    );
};

export default GridWithPoints;
