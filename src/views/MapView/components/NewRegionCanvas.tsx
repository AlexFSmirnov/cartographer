import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useTheme } from '@mui/material';
import { getActiveMapRegions, openNewRegionDialog } from '../../../state';
import { Point, Size, StoreProps } from '../../../types';
import {
    drawRichRect,
    getCanvasPointFromMouseEvent,
    getImageRectFromCanvasRect,
    getRectFromMousePositions,
    getRegionIdFromCanvasPoint,
    useUrlNavigation,
} from '../../../utils';
import { ACTIVE_MAP_PADDING } from '../constants';
import { MapViewCanvas } from '../style';
import { CanvasBaseProps } from './types';

const connectNewRegionCanvas = connect(
    createStructuredSelector({
        activeMapRegions: getActiveMapRegions,
    }),
    {
        openNewRegionDialog,
    }
);

interface NewRegionCanvasProps extends StoreProps<typeof connectNewRegionCanvas>, CanvasBaseProps {
    canvasSize: Size;
    activeMapImageSize: Size;
}

const NewRegionCanvasBase: React.FC<NewRegionCanvasProps> = ({
    canvasSize,
    activeMapImageSize,
    activeMapRegions,
    openNewRegionDialog,
    scale,
    offset,
}) => {
    const theme = useTheme();
    const strokeColor = theme.palette.primary.main;

    const { setUrlParts } = useUrlNavigation();

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const canvasRect = useMemo(
        () => (canvas ? canvas.getBoundingClientRect() : null),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [canvas, setUrlParts]
    );

    const canvasRef = (ref: HTMLCanvasElement | null) => setCanvas(ref);

    const [mouseDownPos, setMouseDownPos] = useState<Point | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.button === 0) {
            setMouseDownPos(getCanvasPointFromMouseEvent(e, canvasRect));
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.button !== 0) {
            return;
        }

        const mousePos = getCanvasPointFromMouseEvent(e, canvasRect);

        if (!mouseDownPos || !mousePos) {
            return;
        }

        const rect = getRectFromMousePositions(mouseDownPos, mousePos);

        if (rect.width > 2 && rect.height > 2) {
            const imageRect = getImageRectFromCanvasRect({
                canvasRect: rect,
                canvasSize,
                imageSize: activeMapImageSize,
                imagePadding: ACTIVE_MAP_PADDING,
                scale,
                offset,
            });

            openNewRegionDialog(imageRect);
            setMouseDownPos(null);
        } else {
            const clickedRegionId = getRegionIdFromCanvasPoint({
                canvasPoint: mousePos,
                regions: activeMapRegions,
                canvasSize,
                imageSize: activeMapImageSize,
                imagePadding: ACTIVE_MAP_PADDING,
                scale,
                offset,
            });

            setUrlParts({ regionId: clickedRegionId });
            setMouseDownPos(null);
        }

        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const mousePos = getCanvasPointFromMouseEvent(e, canvasRect);
        const ctx = canvas?.getContext('2d');

        if (!mouseDownPos || !mousePos || !canvas || !ctx) {
            return;
        }

        const rect = getRectFromMousePositions(mouseDownPos, mousePos);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRichRect({ ctx, rect, strokeColor });
    };

    const canvasProps = {
        ...canvasSize,
        ref: canvasRef,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove,
    };

    return <MapViewCanvas {...canvasProps} />;
};

export const NewRegionCanvas = connectNewRegionCanvas(NewRegionCanvasBase);
