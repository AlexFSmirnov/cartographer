import { createSelector } from 'reselect';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Rect } from '../../types';
import type { State } from '../store';

interface UiState {
    isSidebarOpen: boolean;
    isUploadMapDialogOpen: boolean;
    uploadMapDialogType: 'root' | 'child' | null;

    alertDialogMessage: string | null;

    isFullscreenLoaderOpen: boolean;

    newRegionRect: Rect | null;
}

const initialState: UiState = {
    isSidebarOpen: false,
    isUploadMapDialogOpen: false,
    uploadMapDialogType: null,
    newRegionRect: null,
    alertDialogMessage: null,
    isFullscreenLoaderOpen: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openSidebar: (state) => {
            state.isSidebarOpen = true;
        },
        closeSidebar: (state) => {
            state.isSidebarOpen = false;
        },
        openUploadMapDialog: (state, action: PayloadAction<{ type: 'root' | 'child' }>) => {
            state.isUploadMapDialogOpen = true;
            state.uploadMapDialogType = action.payload.type;
        },
        closeUploadMapDialog: (state) => {
            state.isUploadMapDialogOpen = false;
            state.uploadMapDialogType = null;
        },
        openNewRegionDialog: (state, action: PayloadAction<Rect>) => {
            state.newRegionRect = action.payload;
        },
        closeNewRegionDialog: (state) => {
            state.newRegionRect = null;
        },
        openAlertDialog: (state, action: PayloadAction<string>) => {
            state.alertDialogMessage = action.payload;
        },
        closeAlertDialog: (state) => {
            state.alertDialogMessage = null;
        },
        openFullscreenLoader: (state) => {
            state.isFullscreenLoaderOpen = true;
        },
        closeFullscreenLoader: (state) => {
            state.isFullscreenLoaderOpen = false;
        },
    },
});

export const {
    openSidebar,
    closeSidebar,
    openUploadMapDialog,
    closeUploadMapDialog,
    openNewRegionDialog,
    closeNewRegionDialog,
    openAlertDialog,
    closeAlertDialog,
    openFullscreenLoader,
    closeFullscreenLoader,
} = uiSlice.actions;

export const getUiState = (state: State) => state.ui;

export const getIsSidebarOpen = createSelector(getUiState, (state) => state.isSidebarOpen);
export const getIsUploadMapDialogOpen = createSelector(
    getUiState,
    (state) => state.isUploadMapDialogOpen
);

export const getUploadMapDialogType = createSelector(
    getUiState,
    (state) => state.uploadMapDialogType
);

export const getNewRegionRect = createSelector(getUiState, (state) => state.newRegionRect);

export const getAlertDialogMessage = createSelector(
    getUiState,
    (state) => state.alertDialogMessage
);

export const getIsFullscreenDialogOpen = createSelector(
    getUiState,
    (state) => state.isFullscreenLoaderOpen
);

export default uiSlice.reducer;
