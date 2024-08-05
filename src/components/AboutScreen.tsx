import React, { useEffect, useRef } from "react";
import "../assets/css/about-screen.css";

type AboutScreenProps = {
    lineColor: string;
};

const aboutItems = [
    {
        emoji: "✈️",
        text: "За 21 год я была в 15 странах",
        color: "#BDDBE8",
    },
    {
        emoji: "🏂",
        text: "Я катаюсь на сноуборде и выезжаю покататься, когда есть возможность",
        color: "#F2CBAC",
    },
    {
        emoji: "🐶",
        text: "У меня есть 2 собаки - 2 французских бульдога",
        color: "#F7C6CE",
    },
    {
        emoji: "👩‍💻",
        text: "У меня было 120к подписчиков в инстаграмме",
        color: "#E2E2E2",
    },
    {
        emoji: "🍀",
        text: "Я находила 4-листный клевер 3 раза",
        color: "#C1F5A5",
    },
    {
        emoji: "‍🍞",
        text: "Умею готовить японский хлеб",
        color: "#F3E4BD",
    },
    {
        emoji: "🍝️",
        text: "Люблю готовить разную еду",
        color: "#F0AA9F",
    },
    {
        emoji: "🎾️",
        text: "Увлекаюсь теннисом",
        color: "#EAF2A0",
    },
    {
        emoji: "🚘️",
        text: "У меня есть водительские права",
        color: "#C2EFF2",
    },
    {
        emoji: "🛟",
        text: "Я плавала по реке Нил",
        color: "#ECCAB1",
    },
    {
        emoji: "📓️",
        text: "С 12 лет владею английским в совершенстве",
        color: "#DBDBDB",
    },
];

const AboutScreen: React.FC<AboutScreenProps> = ({ lineColor }) => {
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
        <div className="screen-content about">
            <div className="projects__bar progress-bar">
                <div className="copmpleted" style={{ background: lineColor }} ref={barRef}></div>
            </div>
            <div className="about__wrapper container" ref={wrapperRef}>
                <div className="about__title screen-title">Будем знакомы!</div>
                <div className="about__items">
                    {aboutItems.map((item, index) => (
                        <div key={index} className="item" style={{ backgroundColor: item.color }}>
                            <div className="item__wrap">
                                <div className="item__emoji">{item.emoji}</div>
                                <div className="item__text">{item.text}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutScreen;
