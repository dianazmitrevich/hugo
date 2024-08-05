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
        text: "Компоненты, семантика. карты Яндекс и написание каптч, кастомные поля контактных форм и написание кастомные элементов формы. Генерация и подгрузка json файла.",
        tags: ["pug", "html", "sass", "js", "slick", "json"],
    },
    {
        image: "/assets/img/project-2.png",
        isDarkOverlay: true,
        title: "Интерактивное портфолио",
        text: "Интерактивная игра “соедини точки” - расчет координат и движений курсора, написание событий для отслеживания действий курсора. Рисовка линий с поддержкой физики на канвасе и их передвижение и динамическая генерация. Использование ссылочных хуков, хуков состояния и хуков эффекта. Использование типизации.",
        tags: ["react", "typescript", "jsx", "node", "css"],
    },
    {
        image: "/assets/img/project-3.png",
        isDarkOverlay: false,
        title: "NRG",
        text: "Сайт ресторанов (новая версия). Доработка и использование сборщика верстки - создание задач, использование файловых потоков, минимизатора файлов стилей и скриптов.",
        tags: ["gulp", "pug", "html", "sass", "js", "slick", "node"],
    },
    {
        image: "/assets/img/project-4.png",
        isDarkOverlay: true,
        title: "Супермаркет на React",
        text: "Генерация товаров и покупателей, установка им стоимостей, сканирование товаров. Использование хука useDrop и useDrag. Использование типизации",
        tags: ["node", "react", "typescript", "jsx", "css", "react-dnd"],
    },
    {
        image: "/assets/img/project-5.png",
        isDarkOverlay: true,
        title: "Hackora.dev",
        text: "Сайт для подготовки к собеседованиям молодых специалистов. Регистрация двух ролей, подгрузка своих вопросом и тем. Административная панель, система рейтинга, секция обсуждения вопросов - проверка комментариев на нецензуру.",
        tags: ["php", "js", "html", "sass", "css", "gulp", "pug", "json"],
    },
    {
        image: "/assets/img/project-6.png",
        isDarkOverlay: true,
        title: "Клон Uber",
        text: "Использование Google Maps API для карт, Tailwind для стилей и Redux Toolkit для управления состояния. Расчет и установка маршрута. Использование компонентов навигации React Native.",
        tags: ["tailwind", "react-native", "google-maps", "redux"],
    },
    {
        image: "/assets/img/project-7.png",
        isDarkOverlay: true,
        title: "SSR SSG Blog",
        text: "",
        tags: ["react", "next", "typescript", "node", "jsx"],
    },
    {
        image: "/assets/img/project-8.png",
        isDarkOverlay: false,
        title: "S&C Group",
        text: "",
        tags: ["js", "html", "css", "gulp", "php", "pug", "sass", "json"],
    },
    {
        image: "/assets/img/project-9.png",
        isDarkOverlay: true,
        title: "To-do",
        text: "",
        tags: ["react", "typescript", "mongodb", "node", "jsx", "rest"],
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
