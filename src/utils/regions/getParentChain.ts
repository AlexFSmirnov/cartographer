import { Map, Region } from '../../types';

interface GetParentChainProps {
    region?: Region;
    map?: Map;
    maps: Record<string, Map>;
    regionsByMap: Record<string, Record<string, Region>>;
}

interface Breadcrumb {
    id: string;
    type: 'map' | 'region';
}

export const getParentChain = ({ region, map, maps, regionsByMap }: GetParentChainProps) => {
    if (!region && !map) {
        return [];
    }

    let currentType = region ? 'region' : 'map';
    let currentRegion = region;
    let currentMap = map;

    const chain: Breadcrumb[] = [];

    while (true) {
        if (currentType === 'region') {
            if (!currentRegion) {
                break;
            }

            const { id, parentMapId } = currentRegion;
            chain.push({
                id,
                type: 'region',
            });

            if (parentMapId) {
                currentType = 'map';
                currentMap = maps[parentMapId];
            } else {
                break;
            }
        } else if (currentType === 'map') {
            if (!currentMap) {
                break;
            }

            const { id, parentMapId, parentRegionId } = currentMap;
            chain.push({
                id,
                type: 'map',
            });

            if (parentMapId && parentRegionId) {
                currentType = 'region';
                currentRegion = regionsByMap[parentMapId][parentRegionId];
            } else {
                break;
            }
        }
    }

    return chain.slice(1).reverse();
};
