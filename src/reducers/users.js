import {
    USER_LOGIN_SUCCESS,
    GET_INVITES,
} from '../constants/auth'


const initialState = {
    token: null,
    user: null,
    isAuthenticated: false,
    invites: null,
}

export default function users(state = initialState, action) {
    switch (action.type) {
        case USER_LOGIN_SUCCESS:
            return { ...state, isAuthenticated: true, token: action.data }

        case GET_INVITES:
            return { ...state, invites: action.data }

        default:
            return state
    }
}