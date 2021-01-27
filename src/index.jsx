import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

import App from './app'

axios.defaults.withCredentials = true

ReactDOM.render(<App />, document.getElementById('root'))