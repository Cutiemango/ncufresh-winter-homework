import axios from "axios";

const API_URL = "http://localhost:3001";

export const deleteData = async (apiMethod, query) => {
    try {
        const response = await axios.delete(API_URL + `/${apiMethod}`, {
            params: query ? query : {}
        });
        const responseData = await response.data;
        return responseData;
    } catch (error) {
        return error.response.data;
    }
};

export const postData = async (apiMethod, data) => {
    try {
        const response = await axios.post(API_URL + `/${apiMethod}`, data);
        const responseData = await response.data;
        return responseData;
    } catch (error) {
        return error.response.data;
    }
};

export const getData = async (apiMethod, query) => {
    try {
        const response = await axios.get(API_URL + `/${apiMethod}`, { params: query ? query : {} });
        const responseData = await response.data;
        return responseData;
    } catch (error) {
        return error.response.data;
    }
};
