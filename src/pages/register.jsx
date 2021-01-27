import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

import validate, { postData } from "./apiUtil";
import { LoginStatus, UserContext } from "../app";
import RegisterForm from "../components/RegisterForm";

import "./pages.css";

const RegisterPage = () => {
    const [errors, setErrors] = useState([]);
    const { isLoggedIn, setLoggedIn } = useContext(LoginStatus);
    const { setUser } = useContext(UserContext);

    const handleRegister = async (registerData) => {
        let validationError = validate(registerData);
        if (validationError.length !== 0) {
            setErrors(validationError);
            return;
        }

        let response = await postData("register", registerData);
        if (response.status !== "OK") {
            setErrors([response.message]);
            return;
        }

        setUser(response.user);
        setLoggedIn(true);
    };

    return isLoggedIn ? (
        <Redirect to="/home" />
    ) : (
        <RegisterForm register={handleRegister} error={errors} />
    );
};

export default RegisterPage;
