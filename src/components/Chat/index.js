import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IconButton, Grid, Card, Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core'
import { PlusOutlined, SendOutlined } from '@ant-design/icons'
import { Input } from 'antd'

import styles from './chat.module.scss'
import { chat } from '../../actions'
import WebSocketService from '../../service/websocket'

class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedContact: null,
            msg: ''
        }
        this.socketRef = null
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
        this.socketRef = new WebSocketService()
        this.socketRef.connect()
    }


    handleSelectContact = (contact) => {
        this.setState({
            selectedContact: contact
        })

        this.socketRef.socket.send(JSON.stringify({
            'contact': contact.id
        }))
    }

    handleSendMessage = (event) => {
        event.preventDefault()
        const { msg } = this.state
        let message = msg.trim()
        if (message) {
            this.socketRef.socket.send(JSON.stringify({
                'msg': message
            }))
        }
    }

    render() {
        const { contacts } = this.props
        const { selectedContact } = this.state

        return (
            <Grid container className={styles.container}>
                <Grid xs={3} className={styles.contacts}>
                    <Card className={styles.profileSection}>
                        <Avatar aria-label="recipe">
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
                                            secondary="Message"
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
                                <form
                                    onSubmit={this.handleSendMessage}
                                >
                                    <div className={styles.sendMessageBody}>
                                        <Input
                                            placeholder="Type a message..."
                                            onChange={(event) => this.setState({ msg: event.target.value })}
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
})

const mapDispatchToProps = (dispatch) => ({
    fetchContacts: () => dispatch(chat.fetchContacts()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
