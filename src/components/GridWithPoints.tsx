import React, { useEffect, useState } from "react";
import "./GridWithPoints.css";

const GRID_COLS = parseInt("4", 10);
const GRID_ROWS = parseInt("3", 10);
const GRID_GAP = parseInt("10", 10);

export type GridPoint = {
    x: number;
    y: number;
    size: number;
    sizeX: number;
    sizeY: number;
    isHighlighted?: boolean;
    isHovered?: boolean;
};

const GridWithPoints: React.FC<{
    onPointsReady?: (points: GridPoint[]) => void;
    hoveredPoint?: GridPoint | null;
}> = ({ onPointsReady, hoveredPoint }) => {
    const [gridPoints, setGridPoints] = useState<GridPoint[]>([]);

    useEffect(() => {
        const updateGridPoints = () => {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

            const totalWidth = canvasWidth - (GRID_COLS - 1) * GRID_GAP;
            const totalHeight = canvasHeight - (GRID_ROWS - 1) * GRID_GAP;

            const pointSize = Math.min(totalWidth / GRID_COLS, totalHeight / GRID_ROWS);
            const sizeX = (window.innerWidth - (GRID_COLS - 1) * GRID_GAP) / GRID_COLS;
            const sizeY = (window.innerHeight - (GRID_ROWS - 1) * GRID_GAP) / GRID_ROWS;

            const points: GridPoint[] = [];

            const startX = 0;
            const startY = 0;

            for (let i = 0; i < GRID_COLS; i++) {
                for (let j = 0; j < GRID_ROWS; j++) {
                    points.push({
                        x: startX + i * (sizeX + GRID_GAP) + sizeX / 2,
                        y: startY + j * (sizeY + GRID_GAP) + sizeY / 2,
                        size: pointSize,
                        sizeX: sizeX,
                        sizeY: sizeY,
                        isHighlighted: false,
                        isHovered: false,
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

    const updatedPoints = gridPoints.map((point) => ({
        ...point,
        isHovered: hoveredPoint ? point === hoveredPoint : false,
    }));

    return (
        <div className="dots__container">
            {updatedPoints.map((point, index) => (
                <div
                    key={index}
                    style={{
                        backgroundColor: point.isHovered ? "green" : point.isHighlighted ? "blue" : "grey",
                        minWidth: point.sizeX,
                        maxWidth: point.sizeX,
                        minHeight: point.sizeY,
                        maxHeight: point.sizeY,
                        position: "absolute",
                        left: point.x - point.sizeX / 2,
                        top: point.y - point.sizeY / 2,
                    }}
                    className="dot"
                />
            ))}
        </div>
    );
};

export default GridWithPoints;
