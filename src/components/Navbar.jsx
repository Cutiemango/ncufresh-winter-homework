import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { LoginStatus, UserContext } from "../app";
import { getData } from "../util/apiUtil";
import Button from "./Button";

import "./Navbar.css";

const Navbar = () => {
    const [isMenuActive, setMenuActive] = useState(false);
    
    const { isLoggedIn, setLoggedIn } = useContext(LoginStatus);
    const { user, setUser } = useContext(UserContext);

    const handleClick = () => setMenuActive(!isMenuActive);
    const closeMenu = () => setMenuActive(false);

    const handleLogout = () => {
        setLoggedIn(false);
        setUser({
            account: "",
            name: "",
            isAdmin: false
        });

        getData("logout");
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-logo">
                    NCUFresh
                </Link>
                <div className="nav-icon" onClick={handleClick}>
                    <i className={isMenuActive ? "fas fa-times" : "fas fa-bars"} />
                </div>
                <ul className={isMenuActive ? "nav-menu active" : "nav-menu"}>
                    <li className="nav-item">
                        <Link to="/" className="nav-links" onClick={closeMenu}>
                            Home
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/articles" className="nav-links" onClick={closeMenu}>
                            Articles
                        </Link>
                    </li>

                    {isLoggedIn ? (
                        <li className="nav-item">
                            <Link to="/" className="nav-links" onClick={closeMenu}>
                                Hi, {user.name}
                            </Link>
                        </li>
                    ) : (
                        <li className="nav-item">
                            <Link to="/login" className="nav-links" onClick={closeMenu}>
                                Log In
                            </Link>
                        </li>
                    )}

                    <li className="nav-item">
                        <Link to="/sign-up" className="nav-links-mobile" onClick={closeMenu}>
                            Sign Up
                        </Link>
                    </li>
                </ul>
                {isLoggedIn ? (
                    <Button id="logout" text="Log Out" link="/home" onClick={handleLogout} />
                ) : (
                    <Button id="signup" text="Sign Up" link="/sign-up" />
                )}

                {isLoggedIn && (
                    <Button
                        id="create_article_btn"
                        text="Create New Article"
                        link="/create_article"
                    />
                )}
            </nav>
        </>
    );
};

export default Navbar;
