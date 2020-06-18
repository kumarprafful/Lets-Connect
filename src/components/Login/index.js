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
            emailScreen: true,
            optScreen: false,
            customerInfoScreen: false,
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
                    emailScreen: false,
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
            .then((response) => {
                if (response.ask) {
                    this.setState({
                        loading: false,
                        optScreen: false,
                        customerInfoScreen: true,
                    })
                } else {
                    this.setState({
                        loading: false,
                        optScreen: false
                    })
                    this.props.history.push('/')

                }

            })
            .catch(error => {
                message.error(error.message)
            })
    }

    handleCustomerInfoSubmit = (values) => [
        this.props.updateCustomerInfo(values)
            .then(() => {
                this.props.history.push('/')
            })
            .catch(error => {
                if (error.response) {
                    message.error(error.response.data.message)
                } else {
                    message.error(error.message)
                }
            })
    ]

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
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={this.state.loading}
                >
                    Send OTP
                </Button>
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
                                onClick={() => this.setState({ optScreen: false, emailScreen: true })}
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

    renderCustomerInfoScreen = () => {
        return (
            <Form
                layout="vertical"
                onFinish={this.handleCustomerInfoSubmit}
            >
                <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[
                        {
                            required: true,
                            message: 'This is required'
                        }
                    ]}
                >
                    <Input placeholder="First Name" />
                </Form.Item>

                <Form.Item
                    name="last_name"
                    label="Last Name"
                >
                    <Input placeholder="Last Name" />
                </Form.Item>
                <Button type="primary" htmlType="submit">Get Started</Button>
            </Form>
        )
    }

    renderScreens = () => {
        const { emailScreen, optScreen, customerInfoScreen } = this.state
        if (emailScreen) {
            return this.renderEmailScreen()
        }
        else if (optScreen) {
            return this.renderOTPScreen()
        }
        else if (customerInfoScreen) {
            return this.renderCustomerInfoScreen()
        }

    }

    render() {
        return (
            <div className={styles.container} >
                <div className={styles.loginContainer}>
                    <h1>Let's Connect</h1>
                    {this.renderScreens()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({
    authorize: (data) => dispatch(auth.authorize(data)),
    updateCustomerInfo: (data) => dispatch(auth.updateCustomerInfo(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)