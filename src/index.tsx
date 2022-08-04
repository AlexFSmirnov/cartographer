import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './state/store';
import { register as registerServiceWorkers } from './serviceWorkerRegistration';
import { RouteName } from './routing';
import { App } from './App';
import { MapView, NotesView, RegionsView, NotFound } from './views';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <Provider store={store}>
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
        </Provider>
    </React.StrictMode>
);

registerServiceWorkers();
