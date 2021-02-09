import React from "react";

const BlockButton = ({ children, onClick }) => {
    return (
        <button className="btn block-cube block-cube-hover" onClick={onClick}>
            <div className="bg-top">
                <div className="bg-inner"></div>
            </div>
            <div className="bg-right">
                <div className="bg-inner"></div>
            </div>
            <div className="bg">
                <div className="bg-inner"></div>
            </div>
            <div className="text">{children}</div>
        </button>
    );
};

export default BlockButton;
