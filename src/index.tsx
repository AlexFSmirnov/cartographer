import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { store } from './state/store';
import { register as registerServiceWorkers } from './serviceWorkerRegistration';
import { GlobalStyle } from './style';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyle />
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);

registerServiceWorkers();
