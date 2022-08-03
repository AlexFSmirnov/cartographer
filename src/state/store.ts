import { configureStore } from '@reduxjs/toolkit';
import currentProjectReducer from './slices/currentProjectSlice';
import imagesReducer from './slices/imagesSlice';

export const store = configureStore({
    reducer: {
        currentProject: currentProjectReducer,
        images: imagesReducer,
    },
});

export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
