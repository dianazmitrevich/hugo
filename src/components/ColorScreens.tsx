import React, { useState, useEffect } from "react";

type ColorScreensProps = {
    lineColors: {
        color: string;
        section: string;
        title: string;
    }[];
};

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
                <div key={index} className={`color-screen`} data-index={index} data-color={color.color}>
                    <div className="screen-btn" style={{ backgroundColor: color.color }}></div>
                    <div className="screen-content">
                        <p>20 pixels</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ColorScreens;
