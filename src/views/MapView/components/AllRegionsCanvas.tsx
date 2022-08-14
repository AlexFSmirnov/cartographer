import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useTheme } from '@mui/material';
import { getActiveMapRegions } from '../../../state';
import { drawRichRect, getCanvasRectFromImageRect } from '../../../utils';
import { ACTIVE_MAP_PADDING } from '../constants';
import { MapViewCanvas } from '../style';

interface OwnProps {
    canvasSize: { width: number; height: number };
    activeMapImageSize: { width: number; height: number };
}

interface StateProps {
    activeMapRegions: ReturnType<typeof getActiveMapRegions>;
}

type AllRegionsCanvasProps = OwnProps & StateProps;

const AllRegionsCanvasBase: React.FC<AllRegionsCanvasProps> = ({
    canvasSize,
    activeMapImageSize,
    activeMapRegions,
}) => {
    const theme = useTheme();
    const strokeColor = theme.palette.primary.dark;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const { current: canvas } = canvasRef;
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
    }, [canvasSize, canvasRef, strokeColor, activeMapRegions, activeMapImageSize]);

    return <MapViewCanvas ref={canvasRef} {...canvasSize} />;
};

export const AllRegionsCanvas = connect(
    createStructuredSelector({
        activeMapRegions: getActiveMapRegions,
    })
)(AllRegionsCanvasBase);
