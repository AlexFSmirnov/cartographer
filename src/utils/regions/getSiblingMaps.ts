import { Map } from '../../types';

interface GetSiblingMapsArgs {
    map: Map;
    maps: Record<string, Map>;
}

export const getSiblingMaps = ({ map, maps }: GetSiblingMapsArgs) =>
    Object.values(maps).filter((m) => m.parentRegionId === map.parentRegionId && m.id !== map.id);
