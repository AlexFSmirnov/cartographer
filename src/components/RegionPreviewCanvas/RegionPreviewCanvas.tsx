import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material';
import { Rect } from '../../types';
import { getImageCoverRect } from '../../utils';
import { RegionPreviewCanvasContainer } from './style';

interface RegionPreviewCanvasProps {
    parentMapImage: HTMLImageElement | null;
    regionRect: Rect | null;
}

export const RegionPreviewCanvas: React.FC<RegionPreviewCanvasProps> = ({
    parentMapImage,
    regionRect,
}) => {
    const theme = useTheme();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const containerRef = useCallback(
        (container: HTMLDivElement | null) => {
            if (container && regionRect) {
                const containerRect = container.getBoundingClientRect();

                const { width, height } = getImageCoverRect({
                    imageWidth: regionRect.width,
                    imageHeight: regionRect.height,
                    containerWidth: containerRect.width,
                    containerHeight: containerRect.height,
                    padding: 0,
                });

                setCanvasSize({ width, height });
            }
        },
        [regionRect]
    );

    useEffect(() => {
        const { current: canvas } = canvasRef;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !regionRect || !parentMapImage) {
            return;
        }

        ctx.drawImage(
            parentMapImage,
            regionRect.x,
            regionRect.y,
            regionRect.width,
            regionRect.height,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }, [canvasSize, regionRect, parentMapImage]);

    const containerProps = {
        shadow: theme.shadows[2],
        ref: containerRef,
    };

    return (
        <RegionPreviewCanvasContainer {...containerProps}>
            <canvas {...canvasSize} ref={canvasRef} />
        </RegionPreviewCanvasContainer>
    );
};
