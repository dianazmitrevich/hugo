import React, { useState, useEffect } from "react";

interface ColorScreensProps {
    lineColors: string[];
}

const ColorScreens: React.FC<ColorScreensProps> = ({ lineColors }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleGlobalClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        const colorScreen = target.closest(".color-screen");

        if (colorScreen) {
            const index = parseInt(colorScreen.getAttribute("data-index") || "-1", 10);
            if (index >= 0) {
                console.log(`Clicked on color-screen with index: ${index}`);
                setActiveIndex(index);
            }
        } else {
            setActiveIndex(null);
        }
    };

    useEffect(() => {
        window.addEventListener("click", handleGlobalClick);

        return () => {
            window.removeEventListener("click", handleGlobalClick);
        };
    }, []);

    const handleClick = (index: number) => {
        console.log(`Clicked index: ${index}`);
        setActiveIndex(index);
    };

    return (
        <div className="color-screens">
            {lineColors.map((color, index) => (
                <div
                    key={index}
                    className={`color-screen ${activeIndex === index ? "active" : ""}`}
                    style={{ backgroundColor: color }}
                    data-index={index}
                    data-color={color}></div>
            ))}
        </div>
    );
};

export default ColorScreens;
