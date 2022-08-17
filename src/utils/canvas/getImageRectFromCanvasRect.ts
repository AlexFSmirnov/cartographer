import { Rect } from '../../types';
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

    const x = (canvasRect.x - imageCoverRect.x) * scale;
    const y = (canvasRect.y - imageCoverRect.y) * scale;
    const width = canvasRect.width * scale;
    const height = canvasRect.height * scale;

    return { x, y, width, height };
};
