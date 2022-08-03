import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { register as registerServiceWorkers } from './serviceWorkerRegistration';
import { GlobalStyle } from './style';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <GlobalStyle />
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

registerServiceWorkers();
