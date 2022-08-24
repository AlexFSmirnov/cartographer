import { useEffect, useRef } from 'react';
import { Size } from '../../../types';
import { getImageCoverRect, transformRect } from '../../../utils';
import { ACTIVE_MAP_PADDING } from '../constants';
import { MapViewCanvas } from '../style';
import { CanvasBaseProps } from './types';

interface ActiveMapCanvasProps extends CanvasBaseProps {
    canvasSize: Size;
    activeMapImage: HTMLImageElement | null;
}

export const ActiveMapCanvas: React.FC<ActiveMapCanvasProps> = ({
    canvasSize,
    activeMapImage,
    scale,
    offset,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const { current: canvas } = canvasRef;
        const ctx = canvas?.getContext('2d');

        if (!activeMapImage || !canvas || !ctx) {
            return;
        }

        const { width: imageWidth, height: imageHeight } = activeMapImage;
        const { width: containerWidth, height: containerHeight } = canvasSize;

        const imageRect = getImageCoverRect({
            imageWidth,
            imageHeight,
            containerWidth,
            containerHeight,
            padding: ACTIVE_MAP_PADDING,
        });
        const { x, y, width, height } = transformRect({
            rect: imageRect,
            containerSize: canvasSize,
            scale,
            offset,
        });

        ctx.clearRect(0, 0, containerWidth, containerHeight);
        ctx.drawImage(activeMapImage, x, y, width, height);
    }, [activeMapImage, canvasSize, scale, offset, canvasRef]);

    return <MapViewCanvas ref={canvasRef} {...canvasSize} />;
};
