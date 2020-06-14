import axios from 'axios'

import {
    FETCH_CONTACT_LIST,
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
                console.log("==============>>>>>>>>>>>>", response.data.data.contacts )
                dispatch({ type: FETCH_CONTACT_LIST, data: response.data.data.contacts })
            }
        }
        catch (error) {
            throw error
        }
    }
}