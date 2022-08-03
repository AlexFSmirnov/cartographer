import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { State } from '../store';

interface UiState {
    isSidebarOpen: boolean;
}

const initialState: UiState = {
    isSidebarOpen: false,
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
    },
});

export const { openSidebar, closeSidebar } = uiSlice.actions;

export const getUiState = (state: State) => state.ui;

export const getIsSidebarOpen = createSelector(getUiState, (uiState) => uiState.isSidebarOpen);

export default uiSlice.reducer;
