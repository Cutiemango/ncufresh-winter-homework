import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { getData } from "./pages/apiUtil";
import Home from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ArticlePage from "./pages/articles";
import CreateArticlePage from "./pages/create_article";
import ViewArticlePage from "./pages/view_article";

import Navbar from "./components/Navbar";

import "./app.css";

export const LoginStatus = React.createContext();
export const UserContext = React.createContext();
export const IppOptionContext = React.createContext();

const App = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({
        id: "",
        name: "",
        isAdmin: false
    });
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const fetchSession = async () => {
        const response = await getData("status");
        if (response && response.user) {
            setUser(response.user);
            setLoggedIn(true);
        }
    };

    useEffect(() => fetchSession(), []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <LoginStatus.Provider value={{ isLoggedIn, setLoggedIn }}>
                <IppOptionContext.Provider value={{ itemsPerPage, setItemsPerPage }}>
                    <Router>
                        <Navbar />
                        <Switch>
                            <Route path="/" exact component={Home} />
                            <Route path="/home" exact component={Home} />
                            <Route path="/articles" exact component={ArticlePage} />
                            <Route path="/create_article" exact component={CreateArticlePage} />
                            <Route path="/view_article/:id" component={ViewArticlePage} />
                            <Route path="/login" exact component={LoginPage} />
                            <Route path="/sign-up" exact component={RegisterPage} />
                        </Switch>
                    </Router>
                </IppOptionContext.Provider>
            </LoginStatus.Provider>
        </UserContext.Provider>
    );
};

export default App;
