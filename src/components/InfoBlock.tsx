import React, { useState, useEffect } from "react";

interface InfoBlockProps {
    lineColors: string[];
}

const InfoBlock: React.FC<InfoBlockProps> = ({ lineColors }) => {
    return (
        <div className="info">
            <div className="info__wrap">
                <div className="info__image">
                    <div className="img-cage">
                        <img src="/assets/img/person.jpeg" alt="Diana" />
                    </div>
                </div>
                <div className="info__name">dianazmitrevich</div>
                <div className="info__text">
                    Это интерактивное порфтолио. Чтобы открыть раздел с информацией, соедините две фишки одного цвета
                    нужной линией
                </div>
                <div className="info__tags">
                    <div className="tag">Я тут был 👍</div>
                    <div className="tag">Обо мне</div>
                    <div className="tag">Ссылки</div>
                    <div className="tag">Проекты</div>
                    <div className="tag">Опыт</div>
                </div>
            </div>
        </div>
    );
};

export default InfoBlock;
