import { configureStore } from '@reduxjs/toolkit';
import currentProjectReducer from './slices/currentProjectSlice';
import savedProjectsReducer from './slices/savedProjectsSlice';
import imagesReducer from './slices/imagesSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        currentProject: currentProjectReducer,
        savedProjects: savedProjectsReducer,
        images: imagesReducer,
        ui: uiReducer,
    },
});

export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
