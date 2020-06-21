import { combineReducers } from 'redux'
import users from './users'
import chat from './chat'

export default combineReducers({
    users,
    chat,
})