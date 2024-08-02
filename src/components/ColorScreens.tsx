import React, { useState, useEffect } from "react";

interface ColorScreensProps {
    lineColors: string[];
}

const ColorScreens: React.FC<ColorScreensProps> = ({ lineColors }) => {
    const handleGlobalClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        const colorScreen = target.closest(".color-screen");

        if (colorScreen) {
            if (colorScreen.classList.contains("can-toggle")) {
                colorScreen.classList.add("active");
            }
        } else {
            document.querySelectorAll(".color-screen").forEach((element) => {
                element.classList.remove("active");
            });
        }
    };

    useEffect(() => {
        window.addEventListener("click", handleGlobalClick);

        return () => {
            window.removeEventListener("click", handleGlobalClick);
        };
    }, []);

    return (
        <div className="color-screens">
            {lineColors.map((color, index) => (
                <div
                    key={index}
                    className={`color-screen`}
                    style={{ backgroundColor: color }}
                    data-index={index}
                    data-color={color}></div>
            ))}
        </div>
    );
};

export default ColorScreens;
