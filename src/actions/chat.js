import axios from 'axios'

import {
    FETCH_CONTACT_LIST,
    FETCH_INITIAL_MESSAGES,
    UPDATE_ROOM,
} from '../constants/chat'

export const fetchContacts = () => async (dispatch, getState) => {
    let headers = {
        'Content-Type': 'application/json',
    }
    const token = getState().auth.token

    if (token) {
        headers['Authorization'] = `Token ${token}`

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/accounts/contacts/`,
                { headers }
            )
            if (response.status === 200) {
                dispatch({ type: FETCH_CONTACT_LIST, data: response.data.data.contacts, user: response.data.data.user })
            }
        }
        catch (error) {
            throw error
        }
    }
}

export const fetchInitialMessages = (data) => async (dispatch, getState) => {
    let headers = {
        'Content-Type': 'application/json',
    }
    const token = getState().auth.token

    if (token) {
        headers['Authorization'] = `Token ${token}`

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/chat/messages/?contact=${data}`,
                { headers }
            )
            if (response.status === 200) {
                dispatch({ type: FETCH_INITIAL_MESSAGES, data: response.data.data })
            }
        }
        catch (error) {
            throw error
        }
    }
}

export const updateRoom = (data) => async (dispatch) => {
    if (data) {
        console.log('------',data)
        dispatch({ type: UPDATE_ROOM, data: data })
    }
}