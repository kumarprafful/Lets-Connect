import React, { Component } from 'react'

import axios from 'axios'

import { Form, Input, Button, message } from 'antd'
import styles from './login.module.scss'
import { connect } from 'react-redux'
import { auth } from '../../actions'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            optScreen: false,
            email: null,
        }
    }

    handleLogin = async (values) => {
        console.log(values, process.env.REACT_APP_API_URL)
        this.setState({ loading: true })
        try {
            let response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/email/`,
                values,
            )
            if (response.status === 200) {
                this.setState({
                    optScreen: true,
                    loading: false
                })
            }
        }
        catch (error) {
            this.setState({ loading: false })
        }
    }

    handleAuthorization = (values) => {
        this.props.authorize(values)
            .then(() => {
                this.setState({
                    loading: false,
                    optScreen: false
                })
                this.props.history.push('/')
            })
            .catch(error => {
                message.error(error.message)
            })
    }

    renderEmailScreen = () => {
        return (
            <Form
                layout="vertical"
                size="large"
                onFinish={this.handleLogin}
            >
                <Form.Item
                    label="Email Address"
                    name="email"
                >
                    <Input
                        placeholder="Email Address"
                        onChange={(event) => this.setState({ email: event.target.value })}
                    />
                </Form.Item>
                {/* <Form.Item
                        label="First Name"
                        name="first_name"
                    >
                        <Input
                            placeholder="First Name"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="last_name"
                    >
                        <Input
                            placeholder="Last Name"
                        />
                    </Form.Item> */}
                {/* <Form.Item> */}
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={this.state.loading}
                >
                    Send OTP
                </Button>
                {/* </Form.Item> */}
            </Form>
        )

    }

    renderOTPScreen = () => {
        return (
            <Form
                layout="vertical"
                size="large"
                onFinish={this.handleAuthorization}
            >
                <Form.Item
                    name="email"
                    label="Email Address"
                    extra={
                        <>
                            <span
                                onClick={() => this.setState({ optScreen: false })}
                                className={styles.changeScreenMessage}
                            >
                                Change?
                            </span>
                        </>
                    }
                >
                    <Input
                        value={this.state.email}
                        readOnly
                    />
                </Form.Item>

                <Form.Item
                    name="token"
                    label="OTP"
                >
                    <Input placeholder="OTP" />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={this.state.loading}
                    >
                        Get Started
                    </Button>
                </Form.Item>
            </Form>
        )
    }

    render() {
        const { optScreen } = this.state
        console.log(this.props)

        return (
            <div className={styles.container} >
                <div className={styles.loginContainer}>
                    <h1>Let's Connect</h1>
                    {
                        !optScreen
                            ?
                            this.renderEmailScreen()
                            :
                            this.renderOTPScreen()
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({
    authorize: (data) => dispatch(auth.authorize(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)