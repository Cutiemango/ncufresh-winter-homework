import React from "react";
import { Link } from "react-router-dom";
import "./Button.scss";

const Button = ({ id, text, link, onClick }) => {
    return (
        <Link to={link}>
            <button className="btn" id={id} onClick={onClick}>
                {text}
            </button>
        </Link>
    );
};

export default Button;
