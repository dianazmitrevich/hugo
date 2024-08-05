import React, { useState, useEffect } from "react";
import AboutScreen from "./AboutScreen";
import LinksScreen from "./LinksScreen";
import ProjectsScreen from "./ProjectsScreen";
import ExperienceScreen from "./ExperienceScreen";
import StackScreen from "./StackScreen";

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

    const renderScreen = (section: string, color: string) => {
        switch (section) {
            case "about":
                return <AboutScreen lineColor={color} />;
            case "links":
                return <LinksScreen lineColor={color} />;
            case "projects":
                return <ProjectsScreen lineColor={color} />;
            case "experience":
                return <ExperienceScreen lineColor={color} />;
            case "stack":
                return <StackScreen lineColor={color} />;
            default:
                return null;
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
                    {renderScreen(color.section, color.color)}
                </div>
            ))}
        </div>
    );
};

export default ColorScreens;
