import { Point, Region } from '../../types';

interface GetRegionIdFromImagePointArgs {
    imagePoint: Point;
    regions: Record<string, Region>;
}

export const getRegionIdFromImagePoint = ({
    imagePoint,
    regions,
}: GetRegionIdFromImagePointArgs) => {
    for (const { id, parentRect } of Object.values(regions)) {
        if (
            imagePoint.x >= parentRect.x &&
            imagePoint.x <= parentRect.x + parentRect.width &&
            imagePoint.y >= parentRect.y &&
            imagePoint.y <= parentRect.y + parentRect.height
        ) {
            return id;
        }
    }

    return null;
};
