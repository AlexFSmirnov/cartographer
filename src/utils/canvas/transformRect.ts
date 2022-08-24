import { Point, Rect, Size } from '../../types';

interface TransformRectArgs {
    rect: Rect;
    containerSize: Size;
    scale: number;
    offset: Point;
}

export const transformRect = ({ rect, containerSize, scale, offset }: TransformRectArgs) => {
    const { x, y, width, height } = rect;

    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    const pivotX = containerSize.width / 2;
    const pivotY = containerSize.height / 2;

    const scaledX = pivotX + (x - pivotX) * scale;
    const scaledY = pivotY + (y - pivotY) * scale;

    const offsetX = scaledX + offset.x;
    const offsetY = scaledY + offset.y;

    return {
        x: offsetX,
        y: offsetY,
        width: scaledWidth,
        height: scaledHeight,
    };
};
