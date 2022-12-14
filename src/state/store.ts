import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import currentProjectReducer from './slices/currentProjectSlice';
import preferencesReducer from './slices/preferencesSlice';
import savedProjectsReducer from './slices/savedProjectsSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['ui'],
};

const rootReducer = combineReducers({
    currentProject: currentProjectReducer,
    savedProjects: savedProjectsReducer,
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
