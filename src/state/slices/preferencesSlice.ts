import { createSelector } from 'reselect';
import { createSlice } from '@reduxjs/toolkit';
import type { State } from '../store';

interface PreferencesState {
    isDarkModeEnabled: boolean;
    isEditModeEnabled: boolean;
}

const initialState: PreferencesState = {
    isDarkModeEnabled: true,
    isEditModeEnabled: false,
};

export const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        toggleEditMode: (state) => {
            state.isEditModeEnabled = !state.isEditModeEnabled;
        },
        disableEditMode: (state) => {
            state.isEditModeEnabled = false;
        },
        toggleDarkMode: (state) => {
            state.isDarkModeEnabled = !state.isDarkModeEnabled;
        },
    },
});

export const { toggleEditMode, disableEditMode, toggleDarkMode } = preferencesSlice.actions;

export const getPreferencesState = (state: State) => state.preferences;

export const getIsEditModeEnabled = createSelector(
    getPreferencesState,
    (state) => state.isEditModeEnabled
);
export const getIsDarkModeEnabled = createSelector(
    getPreferencesState,
    (state) => state.isDarkModeEnabled
);

export default preferencesSlice.reducer;
