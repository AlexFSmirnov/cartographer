import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { State } from '../store';

type ImagesSlice = Record<string, string>;

const initialState: ImagesSlice = {};

export const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        setImage: (state, action: PayloadAction<{ id: string; imageDataUrl: string }>) => {
            state[action.payload.id] = action.payload.imageDataUrl;
        },
    },
});

export const { setImage } = imagesSlice.actions;

export const getImagesSlice = (state: State) => state.images;

export default imagesSlice.reducer;
