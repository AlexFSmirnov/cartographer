import { Rect } from '../types';

interface DrawRichRectArgs {
    ctx: CanvasRenderingContext2D;
    rect: Rect;

    centerTitle?: string;
    subtitle?: string;

    strokeColor: string;
    lineWidth?: number;
}

export const drawRichRect = ({
    ctx,
    rect,
    centerTitle,
    subtitle,
    strokeColor,
    lineWidth = 3,
}: DrawRichRectArgs) => {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

    if (centerTitle) {
        const fontSize = Math.max(10, Math.min(rect.width, rect.height) / 5);
        const fontWeight = fontSize > 15 ? 1000 : 400;

        ctx.font = `${fontWeight} ${fontSize}px sans-serif`;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = fontSize > 15 ? 1.5 : 0.5;
        ctx.fillStyle = strokeColor;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(centerTitle, rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width);
        ctx.strokeText(centerTitle, rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width);
    }
};
