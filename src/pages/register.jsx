import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

import { postData } from "../util/apiUtil";
import validate from "../util/validate";
import { LoginStatus, UserContext } from "../app";
import RegisterForm from "../components/RegisterForm";

import "./pages.scss";

const RegisterPage = () => {
    const [errors, setErrors] = useState([]);

    const { isLoggedIn, setLoggedIn } = useContext(LoginStatus);
    const { setUser } = useContext(UserContext);

    const handleRegister = async (registerData) => {
        const validationError = validate(registerData);
        if (validationError.length !== 0) {
            setErrors(validationError);
            return;
        }

        const response = await postData("register", registerData);
        if (response?.status === "OK") {
            setUser(response.user);
            setLoggedIn(true);
        } else {
            setErrors([response.message]);
        }
    };

    return isLoggedIn ? (
        <Redirect to="/home" />
    ) : (
        <RegisterForm register={handleRegister} error={errors} />
    );
};

export default RegisterPage;
