import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IconButton, Grid, Card, Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core'
import { PlusOutlined, SendOutlined } from '@ant-design/icons'
import { Input, message } from 'antd'

import moment from 'moment'

import styles from './chat.module.scss'
import { chat } from '../../actions'

let socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)

class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedContact: null,
            msg: ''
        }
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.props.fetchContacts()
            .then(() => {
                this.setState({ loading: false })
            })
            .catch(error => {
                this.setState({ loading: false })
            })

        socket.onopen = (e) => {
            console.log('connected', e)
            socket.send(JSON.stringify({
                'authorization': `${this.props.token}`
            }))
        }

        socket.onmessage = (e) => {
            console.log('message', e)
            this.props.updateRoom(JSON.parse(e.data))
        }

        socket.onclose = (e) => {
            console.log('close', e)
        }

        socket.onerror = (e) => {
            console.log('error', e)
        }
    }




    handleSelectContact = (contact) => {
        this.setState({
            selectedContact: contact
        })

        this.props.fetchInitialMessages(contact.id)
            .then(() => {
                this.setState({
                    roomId: this.props.room.id
                })
            })
    }

    handleSendMessage = async (event) => {
        event.preventDefault()
        const { msg, roomId } = this.state
        let message = msg.trim()
        console.log(message)
        if (message) {
            try {
                await socket.send(JSON.stringify({
                    'message': {
                        'roomID': roomId,
                        'msg': message
                    }
                }))
                this.setState({ msg: '' })
            }
            catch (error) {
                this.setState({ msg: '' })
            }

        }
    }

    render() {
        const { contacts, room, user } = this.props
        const { selectedContact, msg } = this.state

        console.log('this.props', this.props)

        return (
            <Grid container className={styles.container}>
                <Grid xs={3} className={styles.contacts}>
                    <Card className={styles.profileSection}>
                        <Avatar>
                            R
                        </Avatar>
                        <IconButton>
                            <PlusOutlined />
                        </IconButton>
                    </Card>
                    <List>
                        {
                            contacts
                                ?
                                contacts.map(contact => (
                                    <ListItem
                                        button
                                        key={contact.id}
                                        onClick={() => this.handleSelectContact(contact)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                PK
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={contact.full_name}
                                            secondary={contact.last_message.message}
                                        />
                                    </ListItem>
                                ))
                                : ''
                        }
                    </List>

                </Grid>

                <Grid xs={9} className={styles.messages}>
                    {
                        selectedContact
                            ?
                            <>
                                <Card className={styles.messageSection}>
                                    <div className={styles.title}>
                                        <Avatar>PK</Avatar>
                                        <Typography variant="h6">{selectedContact.full_name}</Typography>
                                    </div>
                                </Card>
                                <div
                                    className={styles.messagesBody}
                                >
                                    {
                                        room
                                            ?
                                            room.messages.map(message => {
                                                if (message.sender === user) {
                                                    return (
                                                        <span className={styles.sentByMe}>
                                                            <span className={styles.msg}>
                                                                {message.message}
                                                                <span className={styles.timestamp}>{moment(message.created_at).format("hh:mm")}</span>
                                                            </span>
                                                        </span>
                                                    )
                                                } else {
                                                    return (
                                                        <span className={styles.sentByOther}>
                                                            <span className={styles.msg}>
                                                                {message.message}
                                                                <span className={styles.timestamp}>{moment(message.created_at).format("hh:mm")}</span>
                                                            </span>
                                                        </span>
                                                    )
                                                }
                                            })
                                            : <div style={{ paddingTop: '5rem' }}>loading</div>
                                    }
                                </div>
                                <form
                                    onSubmit={this.handleSendMessage}
                                >
                                    <div className={styles.sendMessageBody}>
                                        <Input
                                            placeholder="Type a message..."
                                            onChange={(event) => this.setState({ msg: event.target.value })}
                                            value={msg}
                                        />
                                        <IconButton>
                                            <SendOutlined type="submit" />
                                        </IconButton>
                                    </div>
                                </form>
                            </>
                            : ''
                    }
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    token: state.auth.token,
    contacts: state.chat.contactList,
    room: state.chat.initialMessages,
    user: state.chat.user,
})

const mapDispatchToProps = (dispatch) => ({
    fetchContacts: () => dispatch(chat.fetchContacts()),
    fetchInitialMessages: (data) => dispatch(chat.fetchInitialMessages(data)),
    updateRoom: (data) => dispatch(chat.updateRoom(data)),

})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
