import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IconButton, Grid, Card, Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core'
import { PlusOutlined, SendOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { truncate } from '../../utils'
import moment from 'moment'

import styles from './chat.module.scss'
import { chat } from '../../actions'


class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedContact: null,
            msg: ''
        }
        this.socket = null
    }

    connect = () => {
        this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)
        this.socket.onopen = (e) => {
            console.log(e)
            this.socket.send(JSON.stringify({
                'authorization': `${this.props.token}`
            }))
        }

        this.socket.onmessage = (e) => {
            this.props.updateRoom(JSON.parse(e.data))
        }

        this.socket.onclose = (e) => {
            console.log(e)
            // setInterval(() => {
            //     this.connect()
            //     console.log('hi')
            // }, 200)
        }

        this.socket.onerror = (e) => {
            console.log(e)
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

        this.connect()
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
        if (message) {
            try {
                await this.socket.send(JSON.stringify({
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

        return (
            <Grid container className={styles.container}>
                <Grid xs={3} className={styles.contacts}>
                    <Card className={styles.profileSection}>
                        <Avatar>
                            R
                        </Avatar>
                        <IconButton>
                            <PlusOutlined className={styles.lightIcon} />
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
                                        className={selectedContact ? selectedContact.id === contact.id ? styles.active : '' : ''}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                PK
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<p className={styles.name}>{contact.full_name}</p>}
                                            secondary={truncate(contact.last_message.message, 40)}
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
                                                                <span>{message.message}</span>
                                                                <span className={styles.timestamp}>
                                                                    {moment(message.created_at).format("hh:mm")}
                                                                </span>
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
                                        <IconButton
                                            onClick={this.handleSendMessage}
                                        >
                                            <SendOutlined className={styles.lightIcon} type="submit" />
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
