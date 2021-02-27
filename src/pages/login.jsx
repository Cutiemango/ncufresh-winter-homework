import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

import { postData } from "../util/apiUtil";
import validate from "../util/validate";
import { LoginStatus, UserContext } from "../app";
import LoginForm from "../components/LoginForm";

import "./pages.scss";

const LoginPage = () => {
    const [errors, setErrors] = useState([]);
    const { isLoggedIn, setLoggedIn } = useContext(LoginStatus);
    const { setUser } = useContext(UserContext);

    const handleLogin = async (credentials) => {
        const validationError = validate(credentials);
        if (validationError.length !== 0) {
            setErrors(validationError);
            return;
        }

        const response = await postData("login", credentials);
        if (response?.status === "OK") {
            setUser(response.user);
            setLoggedIn(true);
        } else {
            setErrors([response.message]);
        }
    };

    return isLoggedIn ? <Redirect to="/home" /> : <LoginForm login={handleLogin} error={errors} />;
};

export default LoginPage;
