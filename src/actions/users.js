import axios from 'axios'
import {
    USER_LOGIN_SUCCESS,
    GET_INVITES,
} from '../constants/auth'

import { chat } from './index'

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
    const token = getState().users.token
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

export const inviteFriends = (data) => async (dispatch, getState) => {
    const token = getState().users.token
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
    }
    console.log('headers', headers)
    try {
        let response = await axios.post(
            `${process.env.REACT_APP_API_URL}/accounts/invite/`,
            data,
            { headers },
        )
        if (response.status === 200) {
            return response
        }
    }
    catch (error) {
        throw error
    }
}

export const getInvites = () => async (dispatch, getState) => {
    const token = getState().users.token
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
    }
    try {
        let response = await axios.get(
            `${process.env.REACT_APP_API_URL}/accounts/get-invites/`,
            { headers },
        )
        if (response.status === 200) {
            dispatch({ type: GET_INVITES, data: response.data.data })
        }
    }
    catch (error) {
        throw error
    }
}

export const inviteAction = (data) => async (dispatch, getState) => {
    const token = getState().users.token
    console.log('boom.', token)
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
    }
    try {
        let response = await axios.post(
            `${process.env.REACT_APP_API_URL}/accounts/invite-action/`,
            data,
            { headers },
        )
        if (response.status === 200) {
            dispatch(getInvites())
            dispatch(chat.fetchContacts())
        }
    }
    catch (error) {
        throw error
    }
}
