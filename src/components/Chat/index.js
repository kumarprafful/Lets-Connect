import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    IconButton,
    Grid,
    Card,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Menu,
    MenuItem,
    Paper,
    Modal,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@material-ui/core'
import {
    PlusOutlined,
    SendOutlined,
    MoreOutlined,
} from '@ant-design/icons'
import {
    Input,
    // Modal,
    Select,
} from 'antd'

import { withSnackbar } from 'notistack'
import { truncate } from '../../utils'
import moment from 'moment'

import styles from './chat.module.scss'
import { chat, users } from '../../actions'

import Invites from './invites'


class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedContact: null,
            msg: '',
            inviteModal: false,
            inviteList: [],
            moreMenu: null,
            inviteScreen: true,
            errorMessage: null,
            successMessage: null,

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
            selectedContact: contact,
            inviteScreen: false,
        })
        if (this.state.selectedContact !== contact) {
            this.props.fetchInitialMessages(contact.id)
                .then(() => {
                    this.setState({
                        roomId: this.props.room.id
                    })
                })
        }
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

    handleInviteSubmit = () => {
        const { inviteList } = this.state
        if (inviteList.length > 0) {
            this.props.inviteFriends({ 'emails': inviteList })
                .then((response) => {
                    const { invalid_emails, valid_invites, message } = response.data
                    let errorMessage = []
                    if (message.length > 0) {
                        errorMessage.push({
                            key: Math.random(),
                            message: message,
                        })
                    }
                    if (invalid_emails) {
                        if (invalid_emails) {
                            invalid_emails.map(e => errorMessage.push({
                                key: e,
                                email: e
                            }))
                        }
                        if (message) {
                            errorMessage.push({
                                key: 'msg',
                                message: message,
                            })
                        }
                    }
                    if (errorMessage) {
                        errorMessage.map(error => {
                            if (error.email) {
                                this.props.enqueueSnackbar(`${error.email} is an invalid email.`, { variant: 'error' })
                            }
                            if (error.message) {
                                this.props.enqueueSnackbar(error.message, { variant: 'error' })
                            }
                        })
                    }
                    if (valid_invites) {
                        this.props.enqueueSnackbar(`Invites has been sent to ${valid_invites} friends.`, { variant: 'success' })
                    }
                })
                .catch(error => {
                    if (error.response) {
                        this.props.enqueueSnackbar(error.response.data.message, { variant: 'error' })
                    } else {
                        this.props.enqueueSnackbar(error.message, { variant: 'error' })
                    }
                })
            this.setState({
                inviteList: [],
                inviteModal: false,
            })
        }
    }

    render() {
        const { contacts, room, user } = this.props
        const { selectedContact, msg, inviteModal, moreMenu, inviteScreen, inviteList } = this.state

        const handleClose = () => {
            this.setState({ inviteModal: false })
        }

        return (
            <Grid container className={styles.container}>
                <Grid item xs={3}>
                    <Paper className={styles.contacts}>
                        <Card className={styles.profileSection}>
                            <Avatar>
                                R
                                </Avatar>
                            <span>
                                <IconButton
                                    onClick={() => this.setState({ inviteModal: true })}
                                >
                                    <PlusOutlined className={styles.lightIcon} />
                                </IconButton>
                                <IconButton
                                    onClick={(event) => this.setState({ moreMenu: event.currentTarget })}
                                >
                                    <MoreOutlined className={styles.lightIcon} />
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={moreMenu}
                                    keepMounted
                                    open={Boolean(moreMenu)}
                                    onClose={() => this.setState({ moreMenu: null })}
                                >
                                    <MenuItem onClick={() => this.setState({ inviteScreen: true, selectedContact: null, moreMenu: null })}>Invites</MenuItem>
                                    <MenuItem>My account</MenuItem>
                                    <MenuItem>Logout</MenuItem>
                                </Menu>
                            </span>
                        </Card>
                        {/* <Modal
                            visible={inviteModal}
                            onOk={this.handleInviteSubmit}
                            onCancel={() => this.setState({ inviteModal: false })}
                            title="Invite your friends"
                        >
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                dropdownStyle={{ display: 'none' }}
                                value={inviteList}
                                placeholder="Start typing you friends' email addresses to invite them."
                                onChange={(value) => this.setState({ inviteList: value })}
                            />
                        </Modal> */}
                        <Dialog
                            open={inviteModal}
                            onClose={handleClose}
                            className={styles.inviteModal}
                            fullWidth={true}
                            maxWidth="sm"
                            BackdropProps={{ style: { background: '#545454d6' } }}
                        // PaperProps={{ style: { backgroundColor: '#353535' } }}
                        >
                            <DialogTitle>Invite Friends</DialogTitle>
                            <DialogContent>
                                <Select
                                    mode="tags"
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ display: 'none' }}
                                    className={styles.input}
                                    value={inviteList}
                                    placeholder="Start typing you friends' email addresses to invite them."
                                    onChange={(value) => this.setState({ inviteList: value })}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="secondary">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleInviteSubmit}>
                                    Invite
                                </Button>
                            </DialogActions>
                        </Dialog>
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
                    </Paper>
                </Grid>

                <Grid xs={9} className={styles.messages}>
                    {
                        selectedContact || !inviteScreen
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
                                    <Paper className={styles.sendMessageBody}>
                                        <Input
                                            placeholder="Type a message..."
                                            onChange={(event) => this.setState({ msg: event.target.value })}
                                            value={msg}
                                            autoFocus
                                        />
                                        <IconButton
                                            onClick={this.handleSendMessage}
                                        >
                                            <SendOutlined className={styles.lightIcon} type="submit" />
                                        </IconButton>
                                    </Paper>
                                </form>
                            </>
                            :
                            <Invites
                                addFriendOpen={() => this.setState({ inviteModal: true })}
                            />
                    }
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    token: state.users.token,
    contacts: state.chat.contactList,
    room: state.chat.initialMessages,
    user: state.chat.user,
})

const mapDispatchToProps = (dispatch) => ({
    fetchContacts: () => dispatch(chat.fetchContacts()),
    fetchInitialMessages: (data) => dispatch(chat.fetchInitialMessages(data)),
    updateRoom: (data) => dispatch(chat.updateRoom(data)),
    inviteFriends: (data) => dispatch(users.inviteFriends(data)),

})

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Chat))
