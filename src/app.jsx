import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { getData } from './pages/validateCredentials'
import Home from './pages/home'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import Navbar from './components/Navbar'

import './app.css'

export const LoginStatus = React.createContext()
export const UserContext = React.createContext()

const App = () => {
    const [isLoggedIn, setLoggedIn] = useState(false)

    // 使用者資料
    // id: 帳號
    // name: 暱稱
    // isAdmin: 是否為管理員

    const [user, setUser] = useState({
        id: '',
        name: '',
        isAdmin: false
    })

    const readSession = () => {
        const fetchData = async () => {
            const response = await getData('status')
            if (response && response.user)
            {
                setUser(response.user)
                setLoggedIn(true)
            }
        }
        fetchData()
    }

    useEffect(readSession, [])

    return (
        <UserContext.Provider value={{user, setUser}}>
            <LoginStatus.Provider value={{isLoggedIn, setLoggedIn}}>
                <Router>
                    <Navbar />
                    <Switch>
                        <Route path='/' exact component={Home} />
                        <Route path='/login' exact component={LoginPage} />
                        <Route path='/sign-up' exact component={RegisterPage} />
                    </Switch>
                </Router>
            </LoginStatus.Provider>
        </UserContext.Provider>
    )
}

export default App