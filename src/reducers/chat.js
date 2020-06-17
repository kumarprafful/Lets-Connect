import {
    FETCH_CONTACT_LIST,
    FETCH_INITIAL_MESSAGES,
    UPDATE_ROOM,
} from '../constants/chat'


const initialState = {
    contactList: null,
    initialMessages: null,
    user: null,
}

export default function chat(state = initialState, action) {
    switch (action.type) {
        case FETCH_CONTACT_LIST:
            return { ...state, contactList: action.data, user: action.user }

        case FETCH_INITIAL_MESSAGES:
            console.log(action.data)
            return { ...state, initialMessages: action.data }

        case UPDATE_ROOM:
            let initial = state.initialMessages
            let iContactList = state.contactList

            if (initial) {
                if (initial['id'] === action.data['roomID']) {
                    initial['messages'].unshift(action.data['messageObj'])
                }
                // if (iContactList) {
                //     const index = iContactList.contacts.map(x => x.id == action.data)
                // }
                return { ...state, initialMessages: { ...state.initialMessages, initial } }
            }
            return state


        default:
            return state
    }
}