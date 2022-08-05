import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { State } from '../store';

interface UiState {
    isSidebarOpen: boolean;
    isUploadMapDialogOpen: boolean;
}

const initialState: UiState = {
    isSidebarOpen: false,
    isUploadMapDialogOpen: false,
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
        openUploadMapDialog: (state) => {
            state.isUploadMapDialogOpen = true;
        },
        closeUploadMapDialog: (state) => {
            state.isUploadMapDialogOpen = false;
        },
    },
});

export const { openSidebar, closeSidebar, openUploadMapDialog, closeUploadMapDialog } =
    uiSlice.actions;

export const getUiState = (state: State) => state.ui;

export const getIsSidebarOpen = createSelector(getUiState, (state) => state.isSidebarOpen);
export const getIsUploadMapDialogOpen = createSelector(
    getUiState,
    (state) => state.isUploadMapDialogOpen
);

export default uiSlice.reducer;
