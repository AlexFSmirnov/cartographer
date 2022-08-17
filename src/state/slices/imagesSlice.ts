import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { State } from '../store';
import { getActiveMapId } from './currentProjectSlice';

type ImagesSlice = Record<string, string>;

const initialState: ImagesSlice = {};

export const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        saveImage: (state, action: PayloadAction<{ id: string; imageDataUrl: string }>) => {
            state[action.payload.id] = action.payload.imageDataUrl;
        },
        updateImageId: (state, action: PayloadAction<{ oldId: string; newId: string }>) => {
            state[action.payload.newId] = state[action.payload.oldId];
            delete state[action.payload.oldId];
            console.log(Object.keys(state));
        },
        deleteImage: (state, action: PayloadAction<{ id: string }>) => {
            delete state[action.payload.id];
        },
    },
});

export const { saveImage, updateImageId, deleteImage } = imagesSlice.actions;

export const getImagesSlice = (state: State) => state.images;

export const getActiveMapImageDataUrl = createSelector(
    getImagesSlice,
    getActiveMapId,
    (images, activeMapId) => (activeMapId ? images[activeMapId] : null) || null
);

export default imagesSlice.reducer;
