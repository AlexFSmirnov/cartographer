import { Point } from '../types';

export const getRectFromMousePositions = (pos1: Point, pos2: Point) => {
    const x = Math.min(pos1.x, pos2.x);
    const y = Math.min(pos1.y, pos2.y);
    const width = Math.abs(pos1.x - pos2.x);
    const height = Math.abs(pos1.y - pos2.y);

    return { x, y, width, height };
};
