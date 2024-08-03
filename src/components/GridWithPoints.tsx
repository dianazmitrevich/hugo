import React, { useEffect, useState } from "react";
import "./GridWithPoints.css";

const GRID_COLS = 8;
const GRID_ROWS = 5;
const GRID_GAP = 10;
const SPACE_BELOW = 50;
const SKIP_COLS = 3;
const SKIP_ROWS = 3;

export type GridPoint = {
    x: number;
    y: number;
    size: number;
    sizeX: number;
    sizeY: number;
    isHighlighted?: boolean;
    isHovered?: boolean;
    color?: string;
};

const GridWithPoints: React.FC<{
    onPointsReady?: (points: GridPoint[]) => void;
    hoveredPoint?: GridPoint | null;
    lineColors: string[];
    highlightedPointsByColor: { [color: string]: GridPoint[] };
}> = ({ onPointsReady, hoveredPoint, lineColors, highlightedPointsByColor }) => {
    const [gridPoints, setGridPoints] = useState<GridPoint[]>([]);

    useEffect(() => {
        const updateGridPoints = () => {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

            const totalHeight = canvasHeight - SPACE_BELOW - (GRID_ROWS - 1) * GRID_GAP;
            const totalWidth = canvasWidth - (GRID_COLS - 1) * GRID_GAP;
            const pointSize = Math.min(totalWidth / GRID_COLS, totalHeight / GRID_ROWS);
            const sizeX = totalWidth / GRID_COLS;
            const sizeY = totalHeight / GRID_ROWS;

            const points: GridPoint[] = [];

            for (let i = 0; i < GRID_COLS; i++) {
                for (let j = 0; j < GRID_ROWS; j++) {
                    if (i < SKIP_COLS && j < SKIP_ROWS) {
                        continue;
                    }

                    points.push({
                        x: i * (sizeX + GRID_GAP) + sizeX / 2,
                        y: j * (sizeY + GRID_GAP) + sizeY / 2,
                        size: pointSize,
                        sizeX: sizeX,
                        sizeY: sizeY,
                        isHighlighted: false,
                        isHovered: false,
                    });
                }
            }

            const shuffledPoints = [...points];
            for (let i = shuffledPoints.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledPoints[i], shuffledPoints[j]] = [shuffledPoints[j], shuffledPoints[i]];
            }

            const colorAssignments: GridPoint[] = [];

            lineColors.forEach((color) => {
                for (let i = 0; i < 2; i++) {
                    const point = shuffledPoints.pop();
                    if (point) {
                        colorAssignments.push({
                            ...point,
                            color,
                        });
                    }
                }
            });

            while (shuffledPoints.length) {
                colorAssignments.push({
                    ...shuffledPoints.pop()!,
                });
            }

            setGridPoints(colorAssignments);
            if (onPointsReady) {
                onPointsReady(colorAssignments);
            }
        };

        updateGridPoints();
        window.addEventListener("resize", updateGridPoints);

        return () => {
            window.removeEventListener("resize", updateGridPoints);
        };
    }, [onPointsReady, lineColors]);

    const updatedPoints = gridPoints.map((point) => {
        const isHighlighted = Object.keys(highlightedPointsByColor).some((color) =>
            highlightedPointsByColor[color].some(
                (highlightedPoint) => highlightedPoint.x === point.x && highlightedPoint.y === point.y
            )
        );

        return {
            ...point,
            isHighlighted: isHighlighted,
        };
    });

    return (
        <div className="dots__container">
            {updatedPoints.map((point, index) => (
                <div
                    key={index}
                    style={{
                        borderColor: point.color || "grey",
                        backgroundColor: point.isHighlighted ? point.color : "transparent",
                        width: point.sizeX,
                        height: point.sizeY,
                        left: point.x - point.sizeX / 2,
                        top: point.y - point.sizeY / 2,
                    }}
                    className="dot"
                    data-color={point.color}
                    data-x={point.x}
                    data-y={point.y}
                />
            ))}
        </div>
    );
};

export default GridWithPoints;
