import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            contrastText: 'rgba(0, 0, 0, 0.87)',
            dark: '#2d71a8',
            light: '#90caf9',
            main: '#42a5f5',
        },
    },
});
