import { Point, Region } from '../types';
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
