import React, { useState } from 'react';
import axios from 'axios';

import validate from './validateCredentials'
import RegisterForm from '../components/RegisterForm'

import './pages.css';

const RegisterPage = () => {
    const [errors, setErrors] = useState([])

    const handleRegister = (registerData) => {
        console.log(registerData)
        setErrors(validate(registerData))
        // let url = 'https://someurl.com'
        // let options = {
        //     method: 'POST',
        //     url: url,
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json;charset=UTF-8'
        //     },
        //     data: {
        //         account: credentials.account,
        //         password: credentials.password
        //     }
        // }
        // let response = await axios(options)
        // let responseOK = response && response.status === 200 && response.statusText === 'OK'
        // if (responseOK) {
        //     let data = await response.data;
        //     // do something with data
        // }
    }

    return (
        <RegisterForm register={handleRegister} error={errors}/>
    )
}

export default RegisterPage;