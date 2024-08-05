import React, { useEffect, useRef } from "react";
import "../assets/css/links-screen.css";

type LinksScreenProps = {
    lineColor: string;
};

const linkItems = [
    {
        image: "/assets/img/mail.png",
        text: "zmitrevichdiana@gmail.com",
        href: "mailto:zmitrevichdiana@gmail.com",
    },
    {
        image: "/assets/img/github.png",
        text: "dianazmitrevich",
        href: "https://github.com/dianazmitrevich",
    },
    {
        image: "/assets/img/linkedin.png",
        text: "dianazmitrevich",
        href: "https://www.linkedin.com/in/dianazmitrevich/",
    },
    {
        image: "/assets/img/telegram.png",
        text: "dianazmitrevich",
        href: "https://t.me/dianazmitrevich",
    },
    // {
    //     image: "/assets/img/whatsapp.png",
    //     text: "dianazmitrevich",
    //     href: "https://wa.me/",
    // },
];

const LinksScreen: React.FC<LinksScreenProps> = ({ lineColor }) => {
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
        <div className="screen-content links">
            <div className="projects__bar progress-bar">
                <div className="copmpleted" style={{ background: lineColor }} ref={barRef}></div>
            </div>
            <div className="links__wrapper container" ref={wrapperRef}>
                <div className="links__title screen-title">Ссылки</div>
                <div className="links__items">
                    {linkItems.map((item, index) => (
                        <a key={index} className="item" href={item.href}>
                            <div className="item__wrap">
                                <div className="item__img">
                                    <div className="img-cage">
                                        <img src={item.image} alt="Link image" />
                                    </div>
                                </div>
                                <div className="item__text">{item.text}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LinksScreen;
