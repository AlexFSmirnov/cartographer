import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { State } from '../store';
import { getActiveMapRegionId } from './currentProjectSlice';

type ImagesSlice = Record<string, string>;

const initialState: ImagesSlice = {};

export const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        saveImage: (state, action: PayloadAction<{ id: string; imageDataUrl: string }>) => {
            state[action.payload.id] = action.payload.imageDataUrl;
        },
    },
});

export const { saveImage } = imagesSlice.actions;

export const getImagesSlice = (state: State) => state.images;

export const getActiveMapImageDataUrl = createSelector(
    getImagesSlice,
    getActiveMapRegionId,
    (images, activeMapRegionId) => (activeMapRegionId ? images[activeMapRegionId] : null) || null
);

export default imagesSlice.reducer;
