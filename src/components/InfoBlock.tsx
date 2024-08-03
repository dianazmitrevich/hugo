import React, { useState, useEffect } from "react";

type InfoBlockProps = {
    lineColors: {
        color: string;
        section: string;
        title: string;
    }[];
};

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
                    {lineColors.map((color, index) => (
                        <div key={index} className="tag" style={{ backgroundColor: color.color }}>
                            {color.title}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InfoBlock;
