import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette: {
        type: 'dark',
        primary: {
            light: '#1d1d1d',
            main: '#b2102f',
            dark: '#b2102f',
        },
        background: {
            paper: '#151515',
            default: '#1d1d1d'
        }
    }
})

export default theme