import React from "react";

const BlockInput = ({ labelName, inputType, value, placeholder, onChange }) => {
    return (
        <div className="control block-cube block-input">
            <label htmlFor={labelName}>{labelName}</label>
            <input
                type={inputType}
                name={labelName}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            />
            <div className="bg-top">
                <div className="bg-inner"></div>
            </div>
            <div className="bg-right">
                <div className="bg-inner"></div>
            </div>
            <div className="bg">
                <div className="bg-inner"></div>
            </div>
        </div>
    );
};

export default BlockInput;
