import React, { useState } from "react";

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

    const handleErrorMsg =
        error.length > 0 &&
        error.map((msg, idx) => {
            return (
                <h4 className="errorMsg" key={idx}>
                    {msg}
                </h4>
            );
        });

    return (
        <div className="login-form">
            <h2>Login</h2>
            <div className="login-input">
                <label htmlFor="account">Account ID</label>
                <input
                    type="text"
                    name="account"
                    id="login-account"
                    value={credentials.account}
                    onChange={handleInput}
                />
            </div>
            <div className="login-input">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="login-password"
                    value={credentials.password}
                    onChange={handleInput}
                />
            </div>
            <button onClick={handleSubmit}>LET ME INNNN</button>

            {handleErrorMsg}
        </div>
    );
};

export default LoginForm;
