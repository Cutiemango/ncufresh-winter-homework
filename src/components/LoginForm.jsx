import React, { useState } from "react";
import BlockInput from "./BlockInput";
import BlockButton from "./BlockButton";

import "./Form.scss";

const LoginForm = ({ login, error }) => {
    const [credentials, setCredentials] = useState({
        account: "",
        password: ""
    });

    const handleInput = (event) => {
        event.preventDefault();
        setCredentials((prev) => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            };
        });
    };

    const handleSubmit = () => {
        if (credentials.account !== "" && credentials.password !== "") {
            login(credentials);
            setCredentials({ account: "", password: "" });
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
                <h2>Login</h2>
            </div>

            <BlockInput
                labelName="account"
                inputType="text"
                value={credentials.account}
                placeholder="Account"
                onChange={handleInput}
            />

            <BlockInput
                labelName="password"
                inputType="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleInput}
            />

            <BlockButton onClick={handleSubmit}>LET ME INNNN</BlockButton>

            <div id="error_display">{renderErrorMsg}</div>
        </div>
    );
};

export default LoginForm;
