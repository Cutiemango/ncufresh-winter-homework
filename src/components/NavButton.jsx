import React from "react";
import { Link } from "react-router-dom";
import "./NavButton.scss";

const Button = ({ id, text, link, onClick }) => {
    return (
        <Link to={link}>
            <button className="nav_btn" id={id} onClick={onClick}>
                {text}
            </button>
        </Link>
    );
};

export default Button;
