import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { CircularProgress } from '@mui/material';
import { App } from './App';
import { FlexBox } from './components';
import { URL_BASENAME } from './constants';
import { register as registerServiceWorkers } from './serviceWorkerRegistration';
import { persistor, store } from './state/store';
import { RouteName } from './types';
import { ImagesContextProvider } from './utils';
import { MapView, NotesView, RegionsView, NotFound } from './views';

const container = document.getElementById('root');
const root = createRoot(container!);

const Loading = () => (
    <FlexBox fullHeight fullWidth center>
        <CircularProgress />
    </FlexBox>
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ImagesContextProvider>
                <PersistGate loading={<Loading />} persistor={persistor}>
                    <BrowserRouter basename={URL_BASENAME}>
                        <Routes>
                            <Route path="/" element={<App />}>
                                <Route path={`${RouteName.Map}/*`} element={<MapView />} />
                                <Route path={`${RouteName.Notes}/*`} element={<NotesView />} />
                                <Route path={`${RouteName.Regions}/*`} element={<RegionsView />} />
                            </Route>
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </PersistGate>
            </ImagesContextProvider>
        </Provider>
    </React.StrictMode>
);

registerServiceWorkers();
