import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { State } from '../store';

export interface Region {
    id: string;
    name: string;
    description: string;
    notes: string;
    floorNumber: string | null;
    references: string[];
    referencedBy: string[];

    parent: string | null;
    parentRect: [number, number, number, number] | null;
}

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
    id: 'T1',
    name: 'Test Project',
    regions: {},
};

export const currentProjectSlice = createSlice({
    name: 'currentProject',
    initialState,
    reducers: {},
});

export const getCurrentProjectState = (state: State) => state.currentProject;

export default currentProjectSlice.reducer;
