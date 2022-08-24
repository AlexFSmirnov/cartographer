import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useTheme } from '@mui/material';
import { getActiveMapRegions } from '../../../state';
import { Size, StoreProps } from '../../../types';
import { drawRichRect, getCanvasRectFromImageRect, transformRect } from '../../../utils';
import { ACTIVE_MAP_PADDING } from '../constants';
import { MapViewCanvas } from '../style';
import { CanvasBaseProps } from './types';

const connectAllRegionsCanvas = connect(
    createStructuredSelector({
        activeMapRegions: getActiveMapRegions,
    })
);

interface AllRegionsCanvasProps
    extends StoreProps<typeof connectAllRegionsCanvas>,
        CanvasBaseProps {
    canvasSize: Size;
    activeMapImageSize: Size;
}

const AllRegionsCanvasBase: React.FC<AllRegionsCanvasProps> = ({
    canvasSize,
    activeMapImageSize,
    activeMapRegions,
    scale,
    offset,
}) => {
    const theme = useTheme();
    const strokeColor = theme.palette.primary.dark;

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const canvasRef = (ref: HTMLCanvasElement | null) => setCanvas(ref);

    useEffect(() => {
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) {
            return;
        }

        const { width: containerWidth, height: containerHeight } = canvasSize;
        ctx.clearRect(0, 0, containerWidth, containerHeight);

        Object.values(activeMapRegions).forEach(({ parentRect, id }) => {
            if (!parentRect) {
                return;
            }

            const canvasRect = getCanvasRectFromImageRect({
                imageRect: parentRect,
                imageSize: activeMapImageSize,
                canvasSize,
                imagePadding: ACTIVE_MAP_PADDING,
            });

            const rect = transformRect({
                rect: canvasRect,
                containerSize: canvasSize,
                scale,
                offset,
            });

            drawRichRect({
                ctx,
                rect,
                centerTitle: id,
                strokeColor,
                lineWidth: 2,
            });
        });
    }, [canvasSize, canvas, strokeColor, activeMapRegions, activeMapImageSize, scale, offset]);

    return <MapViewCanvas ref={canvasRef} {...canvasSize} />;
};

export const AllRegionsCanvas = connectAllRegionsCanvas(AllRegionsCanvasBase);
