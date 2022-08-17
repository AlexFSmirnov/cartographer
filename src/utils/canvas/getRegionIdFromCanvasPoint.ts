import { Point, Region } from '../../types';
import { getImageRectFromCanvasRect } from './getImageRectFromCanvasRect';

interface GetRegionIdFromCanvasPointArgs {
    canvasPoint: Point;
    regions: Record<string, Region>;
    canvasSize: { width: number; height: number };
    imageSize: { width: number; height: number };
    imagePadding: number;
}

export const getRegionIdFromCanvasPoint = ({
    canvasPoint,
    regions,
    canvasSize,
    imageSize,
    imagePadding,
}: GetRegionIdFromCanvasPointArgs) => {
    const imagePoint = getImageRectFromCanvasRect({
        canvasRect: { ...canvasPoint, width: 1, height: 1 },
        canvasSize,
        imageSize,
        imagePadding,
    });

    const matchingRegions = Object.values(regions).filter(
        ({ parentRect }) =>
            imagePoint.x >= parentRect.x &&
            imagePoint.x <= parentRect.x + parentRect.width &&
            imagePoint.y >= parentRect.y &&
            imagePoint.y <= parentRect.y + parentRect.height
    );

    if (matchingRegions.length === 0) {
        return null;
    }

    const smallestRegion = matchingRegions.reduce((prev, curr) => {
        const prevArea = prev.parentRect.width * prev.parentRect.height;
        const currentArea = curr.parentRect.width * curr.parentRect.height;

        return currentArea < prevArea ? curr : prev;
    }, matchingRegions[0]);

    return smallestRegion.id;
};
