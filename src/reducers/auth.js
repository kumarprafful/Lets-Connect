import {
    USER_LOGIN_SUCCESS
} from '../constants/auth'


const initialState = {
    token: null,
    user: null,
    isAuthenticated: false,
}

export default function auth(state = initialState, action) {
    switch (action.type) {
        case USER_LOGIN_SUCCESS:
            return { ...state, isAuthenticated: true, token: action.data }

        default:
            return state
    }
}