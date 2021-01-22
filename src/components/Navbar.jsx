import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

import { LoginStatus } from '../app'
import Button from './Button'

import './Navbar.css'

const Navbar = ({user}) =>
{
    const [isMenuActive, setMenuActive] = useState(false)
    const {isLoggedIn, setLoggedIn} = useContext(LoginStatus)

    const handleClick = () => setMenuActive(!isMenuActive)
    const closeMenu = () => setMenuActive(false)

    const handleLoginClick = () => setLoggedIn(!isLoggedIn)
    const handleLogout = () => setLoggedIn(false)

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
                        <Link to='/comments' className='nav-links' onClick={closeMenu}>
                            Comments
                        </Link>
                    </li>

                    {!isLoggedIn && <li className='nav-item'>
                        <Link to='/login' className='nav-links' onClick={handleLoginClick}>
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

export default Navbar;