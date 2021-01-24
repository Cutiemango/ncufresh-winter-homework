import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router-dom'

import validate, { postData } from './apiUtil'
import { LoginStatus, UserContext } from '../app'
import LoginForm from '../components/LoginForm'

import './pages.css'

const LoginPage = () => {
    const [errors, setErrors] = useState([])
    const {isLoggedIn, setLoggedIn} = useContext(LoginStatus)
    const {setUser} = useContext(UserContext)

    const handleLogin = async (credentials) => {
        let validationError = validate(credentials)
        if (validationError.length !== 0)
        {
            setErrors(validationError)
            return
        }

        let response = await postData('login', credentials)
        if (response.status !== 'OK')
        {
            setErrors([response.message])
            return
        }
        
        setUser(response.user)
        setLoggedIn(true)
    }

    return (
        isLoggedIn ? <Redirect to='/home' /> : <LoginForm login={handleLogin} error={errors} />
    )
}

export default LoginPage