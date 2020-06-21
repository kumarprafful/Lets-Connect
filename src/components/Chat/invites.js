import React, { Component } from 'react'
import {
    Button,
    Card,
    Grid,
    CardContent,
    Typography,
    CardActions,
} from '@material-ui/core'
import { connect } from 'react-redux'
import moment from 'moment'

import styles from './chat.module.scss'
import { users } from '../../actions'


class Invites extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pendingScreen: true,
            blockedScreen: false,
        }
    }

    componentDidMount() {
        this.props.getInvites()
    }

    renderPendingScreen = () => {
        const { invites } = this.props

        const handleInviteAction = (id, action) => {
            let data = {
                'invite_id': id,
                'action': action,
            }
            this.props.inviteAction(data)
        }

        return (
            invites
                ?
                <Grid
                    container
                    spacing={2}
                >
                    {
                        invites.map(invite => (
                            <Grid item xs={4}>
                                <Card variant="elevation">
                                    <CardContent>
                                        <span className="space-between">
                                            <Typography variant="h5" component="h2" gutterBottom>
                                                {invite.invited_by.full_name}
                                            </Typography>
                                            <Typography variant="secondary" color="textSecondary" gutterBottom>
                                                {moment(invite.created_at).fromNow()}
                                            </Typography>
                                        </span>
                                        <Typography variant="secondary" color="textSecondary" gutterBottom>
                                            {invite.invited_by.email}
                                        </Typography>
                                    </CardContent>

                                    <CardActions>
                                        <Button onClick={() => handleInviteAction(invite.id, true)}>Accept</Button>
                                        <Button onClick={() => handleInviteAction(invite.id, false)} color="secondary">Decline</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>
                : ''
        )
    }

    renderBlockedScreen = () => {
        return (
            <h1>
                Blocked Screen
            </h1>
        )
    }

    renderScreens = () => {
        const { pendingScreen, blockedScreen } = this.state

        if (pendingScreen) {
            return this.renderPendingScreen()
        }
        if (blockedScreen) {
            return this.renderBlockedScreen()
        }
    }

    render() {
        return (
            <div className={styles.invites}>
                <Card className={styles.invitesSection}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            this.setState({
                                pendingScreen: true,
                                blockedScreen: false,
                            })
                        }}
                    >
                        Pending
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            this.setState({
                                blockedScreen: true,
                                pendingScreen: false,
                            })
                        }}
                        disabled

                    >
                        Blocked
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={this.props.addFriendOpen}
                    >
                        Add Friend
                    </Button>
                </Card>
                <div className={styles.screenSection}>
                    {this.renderScreens()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    invites: state.users.invites,
})

const mapDispatchToProps = (dispatch) => ({
    getInvites: () => dispatch(users.getInvites()),
    inviteAction: (data) => dispatch(users.inviteAction(data)),
    inviteFriends: (data) => dispatch(users.inviteFriends(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Invites)