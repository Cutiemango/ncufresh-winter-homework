import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import { LoginStatus, UserContext } from '../app'
import Button from './Button'

import './Navbar.css'

const Navbar = () =>
{
    const [isMenuActive, setMenuActive] = useState(false)
    const {isLoggedIn, setLoggedIn} = useContext(LoginStatus)
    const {user, setUser} = useContext(UserContext)

    const handleClick = () => setMenuActive(!isMenuActive)
    const closeMenu = () => setMenuActive(false)

    const handleLogout = () => {
        setLoggedIn(false)
        setUser({
            account: '',
            name: '',
            isAdmin: false
        })

        let url = 'http://localhost:3001/logout'
        axios.get(url)
    }

    return (
        <>
            <nav className="navbar">
                <Link to='/' className='navbar-logo'>
                    NCUFresh
                </Link>
                <div className="nav-icon" onClick={handleClick}>
                    <i className={isMenuActive ? 'fas fa-times' : "fas fa-bars"} />
                </div>
                <ul className={isMenuActive ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to='/' className='nav-links' onClick={closeMenu}>
                            Home
                        </Link>
                    </li>

                    <li className='nav-item'>
                        <Link to='/articles' className='nav-links' onClick={closeMenu}>
                            Articles
                        </Link>
                    </li>

                    {!isLoggedIn && <li className='nav-item'>
                        <Link to='/login' className='nav-links' onClick={closeMenu}>
                            Log In
                        </Link>
                    </li>}

                    {isLoggedIn && <li className='nav-item'>
                        <Link to='/' className='nav-links' onClick={closeMenu}>
                            Hi, {user.name}
                        </Link>
                    </li>}

                    <li className='nav-item'>
                        <Link to='/sign-up' className='nav-links-mobile' onClick={closeMenu}>
                            Sign Up
                        </Link>
                    </li>
                </ul>
                <Button isLoggedIn={isLoggedIn} handleClick={handleLogout}/>
            </nav>
        </>
    )
}

export default Navbar