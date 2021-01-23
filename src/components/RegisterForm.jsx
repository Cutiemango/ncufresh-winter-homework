import React, { useState } from 'react'

const RegisterForm = ({register, error}) => {
    const [registerData, setRegisterData] = useState({
        account: '',
        name: '',
        password: ''
    })

    const handleInput = (event) => {
        event.preventDefault()

        setRegisterData(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }

    const handleSubmit = () => {
        if (registerData.account !== '' && registerData.password !== '')
        {
            if (registerData.name === '')
                setRegisterData(prev => {return {...prev, name: registerData.account}})
            register(registerData)
        }
    }

    return (
        <div className='reg-form'>
            <h2>Sign Up</h2>
            <div className='reg-input'>
                <label htmlFor='account'>Account ID</label>
                <input
                    type='text'
                    name='account'
                    id='reg-account'
                    value={registerData.account}
                    onChange={handleInput}
                />
            </div>
            <div className='reg-input'>
                <label htmlFor='account'>Nickname</label>
                <input
                    type='text'
                    name='name'
                    id='reg-name'
                    value={registerData.name}
                    onChange={handleInput}
                />
            </div>
            <div className='reg-input'>
                <label htmlFor='password'>Password</label>
                <input
                    type='password'
                    name='password'
                    id='reg-password'
                    value={registerData.password}
                    onChange={handleInput}
                />
            </div>
            <button onClick={handleSubmit}>Join Gura Fan Club</button>
            
            {error.length > 0 && error.map((msg, idx) => {
                return <h4 className='errorMsg' key={idx}>{msg}</h4>
            })}
        </div>
    )
}

export default RegisterForm