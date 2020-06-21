import React from 'react';
import ReactDOM from 'react-dom';
import './assets/scss/index.scss';
import 'antd/dist/antd.dark.css'
import Routes from './Routes';
import * as serviceWorker from './serviceWorker';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import reducers from './reducers';
import { loginUserSuccess } from './actions/users';

import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import darkTheme from './theme/dark'
import { SnackbarProvider } from 'notistack'
const store = createStore(reducers, applyMiddleware(thunk))

let token = localStorage.getItem('token')

if (token) {
    store.dispatch(loginUserSuccess(token))
}

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <MuiThemeProvider theme={darkTheme}>
                <CssBaseline />
                <SnackbarProvider maxSnack={4}>
                    <Routes />
                </SnackbarProvider>
            </MuiThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();
