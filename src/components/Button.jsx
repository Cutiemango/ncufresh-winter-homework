import React from 'react'
import { Link } from 'react-router-dom'
import './Button.css'

const Button = ({isLoggedIn, handleClick}) => {
    return isLoggedIn ?
    (
        <Link to='home'>
            <button className='btn' id='logout' onClick={handleClick}>Log Out</button>
        </Link>

    ) : 
    (
        <Link to='sign-up'>
            <button className='btn' id='signup'>Sign Up</button>
        </Link>
    )
}

export default Button;