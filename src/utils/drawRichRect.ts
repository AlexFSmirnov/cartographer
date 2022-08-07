import { Rect } from '../types';

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
