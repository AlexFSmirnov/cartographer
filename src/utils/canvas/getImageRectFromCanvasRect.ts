import { Point, Rect, Size } from '../../types';
import { getImageCoverRect } from './getImageCoverRect';
import { transformRect } from './transformRect';

interface GetImageRectFromCanvasRectArgs {
    canvasRect: Rect;
    canvasSize: Size;
    imageSize: Size;
    imagePadding: number;
    scale?: number;
    offset?: Point;
}

export const getImageRectFromCanvasRect = ({
    canvasRect,
    canvasSize,
    imageSize,
    imagePadding,
    scale = 1,
    offset = { x: 0, y: 0 },
}: GetImageRectFromCanvasRectArgs) => {
    const transformedCanvasRect = transformRect({
        rect: canvasRect,
        containerSize: canvasSize,
        scale: 1 / scale,
        offset: { x: -offset.x / scale, y: -offset.y / scale },
    });

    const imageCoverRect = getImageCoverRect({
        imageWidth: imageSize.width,
        imageHeight: imageSize.height,
        containerWidth: canvasSize.width,
        containerHeight: canvasSize.height,
        padding: imagePadding,
    });

    const imageScale = imageSize.width / imageCoverRect.width;

    const x = (transformedCanvasRect.x - imageCoverRect.x) * imageScale;
    const y = (transformedCanvasRect.y - imageCoverRect.y) * imageScale;
    const width = transformedCanvasRect.width * imageScale;
    const height = transformedCanvasRect.height * imageScale;

    return { x, y, width, height };
};
