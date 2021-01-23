import axios from 'axios'

const ACCOUNT_REGEX = new RegExp('^[A-Za-z0-9_]+$')
const PASSWORD_REGEX = new RegExp('^[A-Za-z0-9@$!%*#?&]+$')

const API_URL = 'http://localhost:3001'

export const postData = async (apiMethod, data) => {
    axios.defaults.withCredentials = true
    try {
        const response = await axios.post(API_URL + `/${apiMethod}`, data)
        const responseData = await response.data
        return responseData
    }
    catch (error) {
        console.log(error.response.data)
        return error.response.data
    }
}

const validate = (data) => {
    let errors = []

    if (data.account === '')
        errors.push('Account id cannot be empty')
        
    if (data.password === '')
        errors.push('Password cannot be empty')

    if (!ACCOUNT_REGEX.test(data.account))
        errors.push('Account id contains invalid characters')

    if (!PASSWORD_REGEX.test(data.password))
        errors.push('Password contains invalid characters')
    return errors
}

export default validate;