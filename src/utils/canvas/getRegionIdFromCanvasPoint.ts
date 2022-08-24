import { Point, Region, Size } from '../../types';
import { getImageRectFromCanvasRect } from './getImageRectFromCanvasRect';

interface GetRegionIdFromCanvasPointArgs {
    canvasPoint: Point;
    regions: Record<string, Region>;
    canvasSize: Size;
    imageSize: Size;
    imagePadding: number;
    scale?: number;
    offset?: Point;
}

export const getRegionIdFromCanvasPoint = ({
    canvasPoint,
    regions,
    canvasSize,
    imageSize,
    imagePadding,
    scale = 1,
    offset = { x: 0, y: 0 },
}: GetRegionIdFromCanvasPointArgs) => {
    const imagePoint = getImageRectFromCanvasRect({
        canvasRect: { ...canvasPoint, width: 1, height: 1 },
        canvasSize,
        imageSize,
        imagePadding,
        scale,
        offset,
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
