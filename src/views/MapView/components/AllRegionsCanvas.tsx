import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useTheme } from '@mui/material';
import { StoreProps } from '../../../types';
import { getActiveMapRegions } from '../../../state';
import { drawRichRect, getCanvasRectFromImageRect } from '../../../utils';
import { ACTIVE_MAP_PADDING } from '../constants';
import { MapViewCanvas } from '../style';

const connectAllRegionsCanvas = connect(
    createStructuredSelector({
        activeMapRegions: getActiveMapRegions,
    })
);

interface AllRegionsCanvasProps extends StoreProps<typeof connectAllRegionsCanvas> {
    canvasSize: { width: number; height: number };
    activeMapImageSize: { width: number; height: number };
}

const AllRegionsCanvasBase: React.FC<AllRegionsCanvasProps> = ({
    canvasSize,
    activeMapImageSize,
    activeMapRegions,
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

            drawRichRect({
                ctx,
                rect: canvasRect,
                centerTitle: id,
                strokeColor,
                lineWidth: 2,
            });
        });
    }, [canvasSize, canvas, strokeColor, activeMapRegions, activeMapImageSize]);

    return <MapViewCanvas ref={canvasRef} {...canvasSize} />;
};

export const AllRegionsCanvas = connectAllRegionsCanvas(AllRegionsCanvasBase);
