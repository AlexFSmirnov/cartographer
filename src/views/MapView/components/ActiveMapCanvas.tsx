import { useEffect, useRef } from 'react';
import { getImageCoverRect } from '../../../utils';
import { ACTIVE_MAP_PADDING } from '../constants';
import { MapViewCanvas } from '../style';

interface ActiveMapCanvasProps {
    canvasSize: { width: number; height: number };
    activeMapImage: HTMLImageElement | null;
}

export const ActiveMapCanvas: React.FC<ActiveMapCanvasProps> = ({ canvasSize, activeMapImage }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const { current: canvas } = canvasRef;
        const ctx = canvas?.getContext('2d');

        if (!activeMapImage || !canvas || !ctx) {
            return;
        }

        const { width: imageWidth, height: imageHeight } = activeMapImage;
        const { width: containerWidth, height: containerHeight } = canvasSize;

        const { x, y, width, height } = getImageCoverRect({
            imageWidth,
            imageHeight,
            containerWidth,
            containerHeight,
            padding: ACTIVE_MAP_PADDING,
        });

        ctx.drawImage(activeMapImage, x, y, width, height);
    }, [activeMapImage, canvasSize, canvasRef]);

    return <MapViewCanvas ref={canvasRef} {...canvasSize} />;
};
