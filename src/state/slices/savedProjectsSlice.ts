import { createSelector } from 'reselect';
import { createSlice } from '@reduxjs/toolkit';
import { Region } from '../../types';
import type { State } from '../store';

interface SavedProject {
    id: string;
    name: string;
    regions: Record<string, Region>;
}

type SavedProjectsState = Record<string, SavedProject>;

// const initialState: SavedProjectsState = [];

const initialState: SavedProjectsState = {
    T1: { id: 'T1', name: 'Test Project 1', regions: {} },
    T2: { id: 'T2', name: 'Test Project 2', regions: {} },
};

export const savedProjectsSlice = createSlice({
    name: 'savedProjects',
    initialState,
    reducers: {},
});

export const getSavedProjectsState = (state: State) => state.savedProjects;

export const getSavedProjectsNamesAndIds = createSelector(getSavedProjectsState, (state) =>
    Object.values(state).map(({ id, name }) => ({ id, name }))
);

export default savedProjectsSlice.reducer;
