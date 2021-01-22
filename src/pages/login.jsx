import React, { useState } from 'react';
import axios from 'axios';

import validate from './validateCredentials'
import LoginForm from '../components/LoginForm'

import './pages.css';

const LoginPage = () => {
    const [errors, setErrors] = useState([])

    const handleLogin = (credentials) => {
        console.log(credentials)
        setErrors(validate(credentials))
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
        <LoginForm login={handleLogin} error={errors} />
    )
}

export default LoginPage;