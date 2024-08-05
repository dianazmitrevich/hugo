import React, { useState, useEffect } from "react";
import "../assets/css/about-screen.css";

type TechTagsProps = {
    tags: string[];
};

const tagItems = [
    {
        alias: "php",
        text: "PHP",
        color: "#4B8FF5",
        isDarkerText: false,
    },
    {
        alias: "js",
        text: "JavaScript",
        color: "#F4E23A",
        isDarkerText: true,
    },
    {
        alias: "slick",
        text: "Slick.js",
        color: "#B4E2E8",
        isDarkerText: true,
    },
    {
        alias: "react",
        text: "React.js",
        color: "#3BDBE5",
        isDarkerText: true,
    },
    {
        alias: "ts",
        text: "Typescript",
        color: "#2F74BF",
        isDarkerText: true,
    },
];

const TechTags: React.FC<TechTagsProps> = ({ tags }) => {
    let filtered = tagItems.filter((item) => tags.includes(item.alias));

    return (
        <>
            {filtered.map((item, index) => (
                <div
                    key={index}
                    className={item.isDarkerText ? "tech-item darker" : "tech-item"}
                    style={{ backgroundColor: item.color }}>
                    <p>{item.text}</p>
                </div>
            ))}
        </>
    );
};

export default TechTags;
