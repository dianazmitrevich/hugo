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
        alias: "html",
        text: "HTML",
        color: "#E34F26",
        isDarkerText: false,
    },
    {
        alias: "css",
        text: "CSS",
        color: "#1572B6",
        isDarkerText: false,
    },
    {
        alias: "js",
        text: "JavaScript",
        color: "#F4E23A",
        isDarkerText: true,
    },
    {
        alias: "pug",
        text: "Pug",
        color: "#A86454",
        isDarkerText: false,
    },
    {
        alias: "rest",
        text: "RESTful APIs",
        color: "#FF6F61",
        isDarkerText: false,
    },
    {
        alias: "json",
        text: "JSON",
        color: "#E34F26",
        isDarkerText: false,
    },
    {
        alias: "ajax",
        text: "AJAX",
        color: "#FFBF00",
        isDarkerText: true,
    },
    {
        alias: "react",
        text: "React.js",
        color: "#61DAFB",
        isDarkerText: true,
    },
    {
        alias: "node",
        text: "Node.js",
        color: "#8CC84B",
        isDarkerText: true,
    },
    {
        alias: "lottie",
        text: "Lottie",
        color: "#F2C300",
        isDarkerText: true,
    },
    {
        alias: "next",
        text: "Next.js",
        color: "#000000",
        isDarkerText: false,
    },
    {
        alias: "react-native",
        text: "React Native",
        color: "#61DAFB",
        isDarkerText: true,
    },
    {
        alias: "slick",
        text: "Slick.js",
        color: "#B4E2E8",
        isDarkerText: true,
    },
    {
        alias: "jsx",
        text: "JSX",
        color: "#61DAFB",
        isDarkerText: true,
    },
    {
        alias: "react-dnd",
        text: "React-dnd",
        color: "#FF6F61",
        isDarkerText: false,
    },
    {
        alias: "google-maps",
        text: "Google Maps API",
        color: "#4285F4",
        isDarkerText: false,
    },
    {
        alias: "redux",
        text: "Redux Toolkit",
        color: "#764ABC",
        isDarkerText: false,
    },
    {
        alias: "git",
        text: "Git",
        color: "#F1502F",
        isDarkerText: false,
    },
    {
        alias: "docker",
        text: "Docker",
        color: "#2496ED",
        isDarkerText: false,
    },
    {
        alias: "firebase",
        text: "Firebase",
        color: "#FFCA28",
        isDarkerText: true,
    },
    {
        alias: "mongodb",
        text: "MongoDB",
        color: "#47A248",
        isDarkerText: false,
    },
    {
        alias: "webpack",
        text: "Webpack",
        color: "#8CC84B",
        isDarkerText: false,
    },
    {
        alias: "gulp",
        text: "Gulp",
        color: "#CF4647",
        isDarkerText: false,
    },
    {
        alias: "sass",
        text: "Sass",
        color: "#CC6699",
        isDarkerText: false,
    },
    {
        alias: "less",
        text: "Less",
        color: "#1D365D",
        isDarkerText: false,
    },
    {
        alias: "bootstrap",
        text: "Bootstrap",
        color: "#563D7C",
        isDarkerText: false,
    },
    {
        alias: "mui",
        text: "Material-UI",
        color: "#0081CB",
        isDarkerText: false,
    },
    {
        alias: "seo",
        text: "Semantic HTML & Meta Tags",
        color: "#FF5722",
        isDarkerText: false,
    },
    {
        alias: "ru",
        text: "Russian (Native)",
        color: "#0072CE",
        isDarkerText: false,
    },
    {
        alias: "en",
        text: "English (B2-C1)",
        color: "#006400",
        isDarkerText: false,
    },
    {
        alias: "tailwind",
        text: "Tailwind",
        color: "#36B7F0",
        isDarkerText: false,
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
