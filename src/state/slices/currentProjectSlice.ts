import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Region, RootRegion } from '../../types';
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
    reducers: {
        addRootRegion: (state, action: PayloadAction<RootRegion>) => {
            const { id, name } = action.payload;
            state.regions[id] = {
                id,
                name,
                root: true,

                floorNumber: null,
                description: '',
                notes: '',
                references: [],
                referencedBy: [],

                parent: null,
                parentRect: null,
            };
        },
        addRegion: (state, action: PayloadAction<Region>) => {
            state.regions[action.payload.id] = action.payload;
        },
    },
});

export const { addRootRegion, addRegion } = currentProjectSlice.actions;

export const getCurrentProjectState = (state: State) => state.currentProject;

export const getCurrentProjectName = createSelector(getCurrentProjectState, (state) => state.name);

export const getCurrentProjectRegions = createSelector(
    getCurrentProjectState,
    (state) => state.regions
);
export const getCurrentProjectRegionIds = createSelector(getCurrentProjectRegions, (regions) =>
    Object.keys(regions)
);

export default currentProjectSlice.reducer;
