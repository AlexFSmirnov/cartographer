import { Rect } from '../types';
import { getImageCoverRect } from './getImageCoverRect';

interface GetCanvasRectFromImageRectArgs {
    imageRect: Rect;
    canvasSize: { width: number; height: number };
    imageSize: { width: number; height: number };
    imagePadding: number;
}

export const getCanvasRectFromImageRect = ({
    imageRect,
    canvasSize,
    imageSize,
    imagePadding,
}: GetCanvasRectFromImageRectArgs) => {
    const imageCoverRect = getImageCoverRect({
        imageWidth: imageSize.width,
        imageHeight: imageSize.height,
        containerWidth: canvasSize.width,
        containerHeight: canvasSize.height,
        padding: imagePadding,
    });

    const scale = imageCoverRect.width / imageSize.width;

    const x = imageRect.x * scale + imageCoverRect.x;
    const y = imageRect.y * scale + imageCoverRect.y;
    const width = imageRect.width * scale;
    const height = imageRect.height * scale;

    return { x, y, width, height };
};
