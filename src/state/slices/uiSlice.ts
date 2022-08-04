import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { State } from '../store';

interface UiState {
    isSidebarOpen: boolean;
    isEditModeEnabled: boolean;
    isDarkModeEnabled: boolean;
}

const initialState: UiState = {
    isSidebarOpen: false,
    isEditModeEnabled: false,
    isDarkModeEnabled: true,
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
    },
});

export const { openSidebar, closeSidebar, toggleEditMode, toggleDarkMode } = uiSlice.actions;

export const getUiState = (state: State) => state.ui;

export const getIsSidebarOpen = createSelector(getUiState, (state) => state.isSidebarOpen);
export const getIsEditModeEnabled = createSelector(getUiState, (state) => state.isEditModeEnabled);
export const getIsDarkModeEnabled = createSelector(getUiState, (state) => state.isDarkModeEnabled);

export default uiSlice.reducer;
