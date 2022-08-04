import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { State } from '../store';

interface UiState {
    isSidebarOpen: boolean;
    isEditModeEnabled: boolean;
    isDarkModeEnabled: boolean;
    isUploadMapDialogOpen: boolean;
}

const initialState: UiState = {
    isSidebarOpen: false,
    isEditModeEnabled: false,
    isDarkModeEnabled: true,
    isUploadMapDialogOpen: true,
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
        toggleEditMode: (state) => {
            state.isEditModeEnabled = !state.isEditModeEnabled;
        },
        toggleDarkMode: (state) => {
            state.isDarkModeEnabled = !state.isDarkModeEnabled;
        },
        openUploadMapDialog: (state) => {
            state.isUploadMapDialogOpen = true;
        },
        closeUploadMapDialog: (state) => {
            state.isUploadMapDialogOpen = false;
        },
    },
});

export const {
    openSidebar,
    closeSidebar,
    toggleEditMode,
    toggleDarkMode,
    openUploadMapDialog,
    closeUploadMapDialog,
} = uiSlice.actions;

export const getUiState = (state: State) => state.ui;

export const getIsSidebarOpen = createSelector(getUiState, (state) => state.isSidebarOpen);
export const getIsEditModeEnabled = createSelector(getUiState, (state) => state.isEditModeEnabled);
export const getIsDarkModeEnabled = createSelector(getUiState, (state) => state.isDarkModeEnabled);
export const getIsUploadMapDialogOpen = createSelector(
    getUiState,
    (state) => state.isUploadMapDialogOpen
);

export default uiSlice.reducer;
