import { Button } from "antd";
import React from "react";

interface PropButton {
    type: "primary" | "default" | "dashed" | "link" | "text",
    icon?: React.ReactNode,
    style?: React.CSSProperties,
    content?: string,
    onClick?: () => void
}

const ButtonAntd = ({ type, icon, style, onClick, content }: PropButton) => {
    return (
        <>
            <Button 
                type={type}
                icon={icon}
                style={style}
                onClick={onClick}
            >{content}</Button>
        </>
    );
};

export default ButtonAntd;
