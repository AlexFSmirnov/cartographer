export const getCanvasPointFromMouseEvent = (
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
