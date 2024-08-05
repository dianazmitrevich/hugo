import React, { useEffect, useRef } from "react";
import "../assets/css/projects-screen.css";
import TechTags from "./TechTags";

type ProjectsScreenProps = {
    lineColor: string;
};

const projectItems = [
    {
        image: "/assets/img/project-1.png",
        isDarkOverlay: false,
        title: "Лендинг конструктор",
        text: "95 блоков с разной начинкой с реализованным окном настроек. Настройка шрифтов, отступов, цветов и отображения блоков.",
        tags: ["php", "js", "slick"],
    },
    {
        image: "/assets/img/project-2.png",
        isDarkOverlay: true,
        title: "Интерактивное портфолио",
        text: "",
        tags: ["php", "js", "slick"],
    },
    {
        image: "/assets/img/project-1.png",
        isDarkOverlay: false,
        title: "Лендинг конструктор",
        text: "95 блоков с разной начинкой с реализованным окном настроек. Настройка шрифтов, отступов, цветов и отображения блоков.",
        tags: ["php", "js", "slick"],
    },
    {
        image: "/assets/img/project-2.png",
        isDarkOverlay: true,
        title: "Интерактивное портфолио",
        text: "",
        tags: ["php", "js", "slick"],
    },
];

const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ lineColor }) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const barRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const updateCompletedBar = () => {
            if (wrapperRef.current && barRef.current) {
                const wrapperHeight = wrapperRef.current.clientHeight;
                const wrapperScrollHeight = wrapperRef.current.scrollHeight;
                const scrollTop = wrapperRef.current.scrollTop;
                const scrollPercent = (scrollTop / (wrapperScrollHeight - wrapperHeight)) * 100;

                barRef.current.style.width = `${scrollPercent}%`;

                const barParent = barRef.current.parentElement;
                if (barParent) {
                    if (wrapperScrollHeight > wrapperHeight) {
                        barParent.classList.remove("d-none");
                    } else {
                        barParent.classList.add("d-none");
                    }
                }
            }
        };

        const currentWrapperRef = wrapperRef.current;
        currentWrapperRef?.addEventListener("scroll", updateCompletedBar);

        updateCompletedBar();

        return () => {
            currentWrapperRef?.removeEventListener("scroll", updateCompletedBar);
        };
    }, []);

    return (
        <div className="screen-content projects">
            <div className="projects__bar progress-bar">
                <div className="copmpleted" style={{ background: lineColor }} ref={barRef}></div>
            </div>
            <div className="projects__wrapper container" ref={wrapperRef}>
                <div className="projects__title screen-title">Проекты</div>
                <div className="projects__items">
                    {projectItems.map((item, index) => (
                        <div key={index} className="item">
                            <div className="item__wrap">
                                <div className={item.isDarkOverlay ? "item__img dark" : "item__img"}>
                                    <div className="img-cage">
                                        <img src={item.image} alt="Link image" />
                                    </div>
                                </div>
                                <div className="item__title">{item.title}</div>
                                {item.text ? <div className="item__text">{item.text}</div> : ""}
                                <div className="item__tags">
                                    <TechTags tags={item.tags} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectsScreen;
