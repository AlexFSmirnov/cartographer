import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Region } from '../../types';
import type { State } from '../store';

interface CurrentProjectState {
    id: string | null;
    name: string | null;
    regions: Record<string, Region>;
}

// const initialState: CurrentProjectState = {
//     id: null,
//     name: null,
//     regions: {},
// };

const initialState: CurrentProjectState = {
    id: 'COS',
    name: 'Curse of Strahd',
    regions: {},
};

export const currentProjectSlice = createSlice({
    name: 'currentProject',
    initialState,
    reducers: {},
});

export const getCurrentProjectState = (state: State) => state.currentProject;

export const getCurrentProjectName = createSelector(getCurrentProjectState, (state) => state.name);

export default currentProjectSlice.reducer;
