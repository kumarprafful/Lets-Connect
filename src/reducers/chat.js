import {
    FETCH_CONTACT_LIST,
} from '../constants/chat'


const initialState = {
    contactList: null,
}

export default function chat(state = initialState, action) {
    switch (action.type) {
        case FETCH_CONTACT_LIST:
            return { ...state, contactList: action.data }

        default:
            return state
    }
}