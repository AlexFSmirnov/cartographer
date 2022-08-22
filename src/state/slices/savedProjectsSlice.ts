import { createSelector } from 'reselect';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { State, Dispatch } from '../store';
import {
    initialState as emptySavedProject,
    getCurrentProjectState,
    CurrentProjectState as SavedProject,
    setCurrentProject,
} from './currentProjectSlice';

type SavedProjectsState = Record<string, SavedProject>;

const initialState: SavedProjectsState = {};

export const savedProjectsSlice = createSlice({
    name: 'savedProjects',
    initialState,
    reducers: {
        addProject: (
            state,
            action: PayloadAction<Partial<SavedProject> & { id: number; name: string }>
        ) => {
            const { id, name } = action.payload;
            state[id] = {
                ...emptySavedProject,
                id,
                name,
            };
        },
        deleteProject: (state, action: PayloadAction<{ id: number }>) => {
            delete state[action.payload.id];
        },
    },
});

export const { addProject, deleteProject } = savedProjectsSlice.actions;

// --------------------------------------------------------

export const getSavedProjectsState = (state: State) => state.savedProjects;

export const getSavedProjectsNamesAndIds = createSelector(getSavedProjectsState, (state) =>
    Object.values(state).map(({ id, name }) => ({ id, name }))
);

export const getProjectsMaxId = createSelector(
    getSavedProjectsState,
    getCurrentProjectState,
    (savedProjects, currentProject) =>
        Math.max(
            currentProject.id,
            Object.values(savedProjects).reduce((maxId, { id }) => Math.max(maxId, id), 0)
        )
);

// --------------------------------------------------------

export const openProject =
    (newProjectId: number) => (dispatch: Dispatch, getState: () => State) => {
        const state = getState();
        const savedProjects = getSavedProjectsState(state);

        const oldProject = getCurrentProjectState(state);
        const newProject = savedProjects[newProjectId];

        dispatch(addProject(oldProject));

        dispatch(setCurrentProject(newProject));
        dispatch(deleteProject(newProject));
    };

export const createProject = (name: string) => (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const maxId = getProjectsMaxId(state);
    const oldProject = getCurrentProjectState(state);

    const newProjectId = maxId + 1;
    const newProject = { ...emptySavedProject, id: newProjectId, name };

    dispatch(setCurrentProject(newProject));
    dispatch(addProject(oldProject));
};

export default savedProjectsSlice.reducer;
