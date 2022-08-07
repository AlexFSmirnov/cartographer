import { Rect } from '../types';
import { getImageCoverRect } from './getImageCoverRect';

interface GetImageRectFromCanvasRectArgs {
    canvasRect: Rect;
    canvasSize: { width: number; height: number };
    imageSize: { width: number; height: number };
    imagePadding: number;
}

export const getImageRectFromCanvasRect = ({
    canvasRect,
    canvasSize,
    imageSize,
    imagePadding,
}: GetImageRectFromCanvasRectArgs) => {
    const imageCoverRect = getImageCoverRect({
        imageWidth: imageSize.width,
        imageHeight: imageSize.height,
        containerWidth: canvasSize.width,
        containerHeight: canvasSize.height,
        padding: imagePadding,
    });

    const scale = imageSize.width / imageCoverRect.width;

    const scaledImageX = canvasRect.x - imageCoverRect.x;
    const scaledImageY = canvasRect.y - imageCoverRect.y;

    return {
        x: scaledImageX * scale,
        y: scaledImageY * scale,
        width: canvasRect.width * scale,
        height: canvasRect.height * scale,
    };
};
