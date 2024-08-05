import React, { useEffect, useRef } from "react";
import "../assets/css/experience-screen.css";
import TechTags from "./TechTags";

type StackScreenProps = {
    lineColor: string;
};

const projectItems = [
    {
        title: "Frontend",
        tags: ["php", "js", "slick"],
    },
    {
        title: "Backend",
        tags: ["js"],
    },
];

const StackScreen: React.FC<StackScreenProps> = ({ lineColor }) => {
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

    useEffect(() => {
        if (wrapperRef.current) {
            wrapperRef.current.style.setProperty("--line-color", lineColor);
        }
    }, [lineColor]);

    return (
        <div className="screen-content experience">
            <div className="experience__bar progress-bar">
                <div className="copmpleted" style={{ background: lineColor }} ref={barRef}></div>
            </div>
            <div className="experience__wrapper container" ref={wrapperRef} style={{ borderColor: lineColor }}>
                <div className="experience__title screen-title">Мой стек</div>
                <div className="experience__items">
                    {projectItems.map((item, index) => (
                        <div key={index} className="item">
                            <div className="item__wrap">
                                <div className="title-wrap">
                                    <div className="item__title">{item.title}</div>
                                </div>
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

export default StackScreen;
