import { Point, Rect } from '../../types';

export const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement>,
    canvasRect: DOMRect | null
) => {
    if (!canvasRect) {
        return null;
    }

    const { top, left } = canvasRect;
    const x = e.clientX - left;
    const y = e.clientY - top;

    return { x, y };
};

export const getRectFromMousePositions = (pos1: Point, pos2: Point) => {
    const x = Math.min(pos1.x, pos2.x);
    const y = Math.min(pos1.y, pos2.y);
    const width = Math.abs(pos1.x - pos2.x);
    const height = Math.abs(pos1.y - pos2.y);

    return { x, y, width, height };
};

interface DrawRichRectArgs {
    ctx: CanvasRenderingContext2D;
    rect: Rect;

    strokeColor: string;
}

export const drawRichRect = ({ ctx, rect, strokeColor }: DrawRichRectArgs) => {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
};
