import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { store } from './state/store';
import { register as registerServiceWorkers } from './serviceWorkerRegistration';
import { GlobalStyle } from './style';
import App from './App';
import { MapView, NotesView, RegionsView, NotFound } from './views';
import { RouteName } from './routing';

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
                <BrowserRouter basename="/dnd-map-helper">
                    <Routes>
                        <Route path="/" element={<App />}>
                            <Route path={`${RouteName.Map}/*`} element={<MapView />} />
                            <Route path={`${RouteName.Notes}/*`} element={<NotesView />} />
                            <Route path={`${RouteName.Regions}/*`} element={<RegionsView />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);

registerServiceWorkers();
