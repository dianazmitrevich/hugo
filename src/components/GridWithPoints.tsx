import React, { useEffect, useState } from "react";
import "./GridWithPoints.css";

const GRID_COLS = 4;
const GRID_ROWS = 3;
const GRID_GAP = 10;

export type GridPoint = {
    x: number;
    y: number;
    size: number;
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
            const pointWidth = totalWidth / GRID_COLS;
            const pointHeight = totalHeight / GRID_ROWS;

            const pointSize = Math.min(pointWidth, pointHeight);

            const points: GridPoint[] = [];

            for (let i = 0; i < GRID_COLS; i++) {
                for (let j = 0; j < GRID_ROWS; j++) {
                    points.push({
                        x: i * (pointWidth + GRID_GAP) + pointSize / 2,
                        y: j * (pointHeight + GRID_GAP) + pointSize / 2,
                        size: pointSize,
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
                        width: point.size,
                        height: point.size,
                        position: "absolute",
                        left: point.x - point.size / 2,
                        top: point.y - point.size / 2,
                    }}
                    className="dot"
                />
            ))}
        </div>
    );
};

export default GridWithPoints;
