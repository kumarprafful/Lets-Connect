import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Chat from './components/Chat'
import Login from './components/Login'
import { connect } from 'react-redux'

class Routes extends Component {
    PrivateRoute = ({ component: ChildComponent, ...rest }) => {
        return <Route {...rest} render={props => {
            if (!this.props.auth.isAuthenticated) {
                return <Redirect to='/login/' />
            }
            else {
                return <ChildComponent {...props} />
            }
        }} />
    }

    render() {
        const PrivateRoute = this.PrivateRoute

        return (
            <Router>
                <Switch>
                    <PrivateRoute path='/' component={Chat} exact />
                    <Route path='/login/' component={Login} exact />
                </Switch>
            </Router>
        )
    }
}


const mapStateToProps = state => ({
    auth: state.users,
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Routes)