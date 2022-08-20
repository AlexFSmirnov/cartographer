import { createSelector } from 'reselect';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Region, Map } from '../../types';
import type { State } from '../store';

interface CurrentProjectState {
    id: string | null;
    name: string | null;
    activeMapId: string | null;
    maps: Record<string, Map>;
    regions: Record<string, Record<string, Region>>;
}

const initialState: CurrentProjectState = {
    id: 'COS',
    name: 'Curse of Strahd',
    activeMapId: null,
    maps: {},
    regions: {},
};

export const currentProjectSlice = createSlice({
    name: 'currentProject',
    initialState,
    reducers: {
        addMap(state, action: PayloadAction<Map>) {
            const { id } = action.payload;
            state.maps[id] = action.payload;
            state.regions[id] = {};
        },
        updateMap(state, action: PayloadAction<{ oldId: string; map: Map }>) {
            const { oldId, map } = action.payload;

            if (oldId !== map.id) {
                delete state.maps[oldId];
            }

            state.maps[map.id] = action.payload.map;
        },
        deleteMap(state, action: PayloadAction<{ mapId: string }>) {
            delete state.maps[action.payload.mapId];
        },
        addRegion: (state, action: PayloadAction<Region>) => {
            const { activeMapId } = state;
            if (activeMapId) {
                if (!state.regions[activeMapId]) {
                    state.regions[activeMapId] = {};
                }

                state.regions[activeMapId][action.payload.id] = action.payload;
            }
        },
        setActiveMapId: (state, action: PayloadAction<string | null>) => {
            state.activeMapId = action.payload;
        },
        setRegionDescription: (
            state,
            action: PayloadAction<{ regionId: string; activeMapId: string; description: string }>
        ) => {
            const { regionId, activeMapId, description } = action.payload;

            if (state.regions?.[activeMapId]?.[regionId]) {
                state.regions[activeMapId][regionId].description = description;
            }
        },
        setRegionNotes: (
            state,
            action: PayloadAction<{ regionId: string; activeMapId: string; notes: string }>
        ) => {
            const { regionId, activeMapId, notes } = action.payload;

            if (state.regions?.[activeMapId]?.[regionId]) {
                state.regions[activeMapId][regionId].notes = notes;
            }
        },
        deleteRegion: (state, action: PayloadAction<{ regionId: string; activeMapId: string }>) => {
            const { regionId, activeMapId } = action.payload;
            delete state.regions[activeMapId][regionId];
        },
    },
});

export const {
    addMap,
    updateMap,
    deleteMap,
    addRegion,
    setActiveMapId,
    setRegionDescription,
    setRegionNotes,
    deleteRegion,
} = currentProjectSlice.actions;

export const getCurrentProjectState = (state: State) => state.currentProject;

export const getCurrentProjectName = createSelector(getCurrentProjectState, (state) => state.name);

export const getCurrentProjectMaps = createSelector(getCurrentProjectState, (state) => state.maps);
export const getCurrentProjectMapIds = createSelector(getCurrentProjectMaps, (maps) =>
    Object.keys(maps)
);
export const getCurrentProjectRootMap = createSelector(getCurrentProjectMaps, (maps) =>
    Object.values(maps).find((map) => map.parent === null)
);
export const getCurrentProjectRootMapId = createSelector(
    getCurrentProjectRootMap,
    (map) => map?.id || null
);

export const getCurrentProjectRegionsByMap = createSelector(
    getCurrentProjectState,
    (state) => state.regions
);

export const getCurrentProjectAllRegions = createSelector(
    getCurrentProjectRegionsByMap,
    (regionsByMap) => Object.values(regionsByMap).map(Object.values).flat() as Region[]
);

export const getCurrentProjectRegionIds = createSelector(
    getCurrentProjectRegionsByMap,
    (regionsByMap) => Object.values(regionsByMap).map(Object.keys).flat()
);

export const getActiveMapId = createSelector(getCurrentProjectState, (state) => state.activeMapId);

export const getActiveMapRegions = createSelector(
    getCurrentProjectRegionsByMap,
    getActiveMapId,
    (regionsByMap, activeMapId) => (activeMapId ? regionsByMap[activeMapId] : {})
);

export default currentProjectSlice.reducer;
