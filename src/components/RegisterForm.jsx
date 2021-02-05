import React, { useState } from "react";
import BlockInput from "./BlockInput";

import "./Form.scss";

const RegisterForm = ({ register, error }) => {
    const [registerData, setRegisterData] = useState({
        account: "",
        name: "",
        password: ""
    });

    const handleInput = (event) => {
        event.preventDefault();

        setRegisterData((prev) => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            };
        });
    };

    const handleSubmit = () => {
        if (registerData.account !== "" && registerData.password !== "") {
            if (registerData.name === "")
                setRegisterData((prev) => {
                    return { ...prev, name: registerData.account };
                });
            register(registerData);
        }
    };

    const renderErrorMsg =
        error.length > 0 &&
        error.map((msg, idx) => {
            return (
                <h4 className="errorMsg" key={idx}>
                    {msg}
                </h4>
            );
        });

    return (
        <div className="form">
            <div className="control">
                <h2>Sign Up</h2>
            </div>

            <BlockInput
                labelName="account"
                inputType="text"
                value={registerData.account}
                placeholder="Account"
                onChange={handleInput}
            />

            <BlockInput
                labelName="name"
                inputType="text"
                value={registerData.name}
                placeholder="Nickname"
                onChange={handleInput}
            />

            <BlockInput
                labelName="password"
                inputType="password"
                value={registerData.password}
                placeholder="Password"
                onChange={handleInput}
            />

            <button className="btn block-cube block-cube-hover" onClick={handleSubmit}>
                <div className="bg-top">
                    <div className="bg-inner"></div>
                </div>
                <div className="bg-right">
                    <div className="bg-inner"></div>
                </div>
                <div className="bg">
                    <div className="bg-inner"></div>
                </div>
                <div className="text">
                    <img src="https://i.imgur.com/MmGksbg.png"></img>
                    Join Gura Fan Club
                    </div>
            </button>

            <div className="error_display">{renderErrorMsg}</div>
        </div>
    );
};

export default RegisterForm;
