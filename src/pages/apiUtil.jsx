import axios from 'axios'

const ACCOUNT_REGEX = new RegExp('^[A-Za-z0-9_]+$')
const PASSWORD_REGEX = new RegExp('^[A-Za-z0-9@$!%*#?&]+$')

const API_URL = 'http://localhost:3001'

export const deleteData = async (apiMethod, query) => {
    try {
        const response = await axios.delete(API_URL + `/${apiMethod}`, { params: (query ? query : {}) })
        const responseData = await response.data
        return responseData
    }
    catch (error) {
        return error.response.data
    }
}

export const postData = async (apiMethod, data) => {
    try {
        const response = await axios.post(API_URL + `/${apiMethod}`, data)
        const responseData = await response.data
        return responseData
    }
    catch (error) {
        return error.response.data
    }
}

export const getData = async (apiMethod, query) => {
    try {
        const response = await axios.get(API_URL + `/${apiMethod}`, { params: (query ? query : {}) })
        const responseData = await response.data
        return responseData
    }
    catch (error) {
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