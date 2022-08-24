import { Rect } from '../../types';

interface DrawRichRectArgs {
    ctx: CanvasRenderingContext2D;
    rect: Rect;

    centerTitle?: string;
    subtitle?: string;

    strokeColor?: string;
    contrastColor?: string;
    lineWidth?: number;
}

const SUBTITLE_PADDING = 2;

export const drawRichRect = ({
    ctx,
    rect,
    centerTitle,
    subtitle,
    strokeColor = '#f00',
    contrastColor = '#fff',
    lineWidth = 3,
}: DrawRichRectArgs) => {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

    if (centerTitle) {
        const fontSize = Math.max(16, Math.min(30, Math.min(rect.width, rect.height) / 5));

        ctx.font = `1000 ${fontSize}px sans-serif`;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.fillStyle = strokeColor;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.strokeText(centerTitle, rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width);
        ctx.fillText(centerTitle, rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width);
    }

    if (subtitle) {
        const textHeight = 20;

        ctx.font = `${textHeight}px sans-serif`;

        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';

        const textMetrics = ctx.measureText(subtitle);
        const subtitleBackgroundWidth = Math.max(
            rect.width + lineWidth,
            0,
            textMetrics.width + SUBTITLE_PADDING * 2 + lineWidth * 2
        );
        const subtitleBackgroundHeight = textHeight + SUBTITLE_PADDING * 2 + lineWidth;

        ctx.fillStyle = strokeColor;
        ctx.fillRect(
            rect.x - lineWidth / 2,
            rect.y + rect.height,
            subtitleBackgroundWidth,
            subtitleBackgroundHeight
        );

        ctx.fillStyle = contrastColor;
        ctx.fillText(
            subtitle,
            rect.x + SUBTITLE_PADDING + lineWidth / 2,
            rect.y + rect.height + SUBTITLE_PADDING + lineWidth / 2,
            subtitleBackgroundWidth
        );
    }
};
