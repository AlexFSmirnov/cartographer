import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Region, RootRegion } from '../../types';
import type { State } from '../store';

interface CurrentProjectState {
    id: string | null;
    name: string | null;
    activeMapRegionId: string | null;
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
    activeMapRegionId: null,
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
        setActiveMapRegionId: (state, action: PayloadAction<string | null>) => {
            state.activeMapRegionId = action.payload;
        },
    },
});

export const { addRootRegion, addRegion, setActiveMapRegionId } = currentProjectSlice.actions;

export const getCurrentProjectState = (state: State) => state.currentProject;

export const getCurrentProjectName = createSelector(getCurrentProjectState, (state) => state.name);

export const getCurrentProjectRegions = createSelector(
    getCurrentProjectState,
    (state) => state.regions
);
export const getCurrentProjectRegionIds = createSelector(getCurrentProjectRegions, (regions) =>
    Object.keys(regions)
);
export const getCurrentProjectFirstRootRegionId = createSelector(
    getCurrentProjectRegions,
    (regions) => {
        const rootRegions = Object.values(regions).filter((region) => region.root);
        return rootRegions.length > 0 ? rootRegions[0].id : null;
    }
);

export const getActiveMapRegionId = createSelector(
    getCurrentProjectState,
    (state) => state.activeMapRegionId
);

export default currentProjectSlice.reducer;
