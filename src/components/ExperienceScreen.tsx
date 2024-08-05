import React, { useEffect, useRef } from "react";
import "../assets/css/experience-screen.css";
import TechTags from "./TechTags";

type ExperienceScreenProps = {
    lineColor: string;
};

const projectItems = [
    {
        title: "Frontend разработчик, Webcompany",
        time: "8 месяцев (2024 - т.в.)",
        text: [
            "Занимаюсь поддержкой текущих проектов - подключение новых библиотек, правка верстки и скриптов, написание новых модулей страницы для интеграции с CMS системами.",
            "Разработка проекта конструктора - компонентных подход в верстке, использование семантики. Встраивание карт и написание каптч, обработка полей контактных форм и написание кастомной стилизации элементов формы. подгрузка данных из json файла.",
            "Поддержка давних проектов - рефакторинг кода и переписывание некоторых модулей согласно пожеланиям заказчика.",
            "Постановка и оценка задач - временная оценка на реализацию задачи.",
            "Инструменты - использование системы контроля версий, подключение по ftp, sftp.",
            "Разработка уникальных решений - создание прелоудеров, написание кастомных скриптов для слайдеров.",
        ],
        tags: [],
    },
    {
        title: "Frontend разработчик, S&C Group",
        time: "2 года 9 месяцев (2021 - т.в.)",
        text: [
            "Разработка проекта сайтов ресторанов - написание компонентов и модулей проекта. Тестирование и правка проекта. Написание новой улучшенной версии сайта с использованием другого фреймворка.",
            "Разработка сайта компании - создание административной панели, сортировки, фильтрации и поиска. посадка проекта на cms систему. Разработка новой улучшенной версии сайта с использованием модулей текстового редактора, конструктора блоков.",
            "Разработка уникальных решений - работа со swagger, посадка верстки на шаблоны python, верстка сложных анимаций, создание одностраничных проектов, использование firebase.",
            "Инструменты - использование системы контроля версий, досок канбан.",
        ],
        tags: [],
    },
    {
        title: "Frontend разработчик, Invatechs",
        time: "2 месяца (2023)",
        text: [
            "Доработка своего сборщика верстки и применение его в разработке проекта сайта.",
            "Реализация проекта - создание канбан доски с бэклогом, выбор инструментов для реализации.",
            "Инструменты - использование системы контроля версий.",
        ],
        tags: [],
    },
    {
        title: "Backend PHP разработчик, Innowise Group",
        time: "2 месяца (2022)",
        text: [
            "Написание решений и прохождение юнит тестов.",
            "Инструменты - изучение паттернов и принципов разработки, использование системы контроля версий, написание докер контейнеров, использование REST API подхода в разработке.",
        ],
        tags: [],
    },
    {
        title: "Техник-программист, Студия Борового",
        time: "1 год 3 месяца (2021)",
        text: [
            "Поддержка использования CMS на проектах существующих и новых.",
            "Поддержка 5+ проектов на протяжении всего их жизненного цикла, постановка задач разработчикам и контроль процессов сдачи проектов.",
            "Совершенство профессиональных языковых навыков и изучение принципов управления, что позволило наладить эффективную коммуникацию между техническими отделами и обеспечить качественную удаленную работу.",
        ],
        tags: ["php", "js", "slick"],
    },
];

const ExperienceScreen: React.FC<ExperienceScreenProps> = ({ lineColor }) => {
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
                <div className="experience__title screen-title">Опыт</div>
                <div className="experience__items">
                    {projectItems.map((item, index) => (
                        <div key={index} className="item">
                            <div className="item__wrap">
                                <div className="title-wrap">
                                    <div className="item__title">{item.title}</div>
                                    <div className="item__time">{item.time}</div>
                                </div>
                                {item.text ? (
                                    <div className="item__text">
                                        <ul>
                                            {item.text.map((textItem, index) => (
                                                <li key={index}>{textItem}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    ""
                                )}
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

export default ExperienceScreen;
