import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import currentProjectReducer from './slices/currentProjectSlice';
import savedProjectsReducer from './slices/savedProjectsSlice';
import imagesReducer from './slices/imagesSlice';
import uiReducer from './slices/uiSlice';
import preferencesReducer from './slices/preferencesSlice';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['ui'],
};

const rootReducer = combineReducers({
    currentProject: currentProjectReducer,
    savedProjects: savedProjectsReducer,
    images: imagesReducer,
    ui: uiReducer,
    preferences: preferencesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
