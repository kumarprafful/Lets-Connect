import axios from 'axios'
import {
    USER_LOGIN_SUCCESS,
} from '../constants/auth'


export const loginUserSuccess = (token) => async dispatch => {
    localStorage.setItem('token', token)
    dispatch({ type: USER_LOGIN_SUCCESS, data: token })
}

export const authorize = (data) => async (dispatch, getState) => {
    let headers = {
        'Content-Type': 'application/json'
    }
    try {
        let response = await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/token/`,
            data,
            { headers },
        )
        if (response.status === 200) {
            dispatch(loginUserSuccess(response.data.token))
            return response.data
        }
    }
    catch (error) {
        throw error
    }
}

export const updateCustomerInfo = (data) => async (dispatch, getState) => {
    const token = getState().auth.token
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
    }
    try {
        let response = await axios.post(
            `${process.env.REACT_APP_API_URL}/accounts/update/`,
            data,
            { headers },
        )
        if (response.status === 200) {
            return
        }
    }
    catch (error) {
        throw error
    }
}