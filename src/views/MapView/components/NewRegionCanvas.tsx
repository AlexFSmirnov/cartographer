import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Point } from '../../../types';
import {
    drawRichRect,
    getCanvasPointFromMouseEvent,
    getImageRectFromCanvasRect,
    getRectFromMousePositions,
} from '../../../utils';
import { useTheme } from '@mui/material';
import { getActiveMapRegions, openNewRegionDialog } from '../../../state';
import { MapViewCanvas } from '../style';
import { ACTIVE_MAP_PADDING } from '../constants';
import { createStructuredSelector } from 'reselect';
import { getRegionIdFromImagePoint } from '../../../utils/getRegionIdFromImagePoint';
import { getRegionIdFromCanvasPoint } from '../../../utils/getRegionIdFromCanvasPoint';

interface OwnProps {
    canvasSize: { width: number; height: number };
    activeMapImageSize: { width: number; height: number };
}

interface StateProps {
    activeMapRegions: ReturnType<typeof getActiveMapRegions>;
}

interface DispatchProps {
    openNewRegionDialog: typeof openNewRegionDialog;
}

type NewRegionCanvasProps = OwnProps & StateProps & DispatchProps;

const NewRegionCanvasBase: React.FC<NewRegionCanvasProps> = ({
    canvasSize,
    activeMapImageSize,
    activeMapRegions,
    openNewRegionDialog,
}) => {
    const theme = useTheme();
    const strokeColor = theme.palette.primary.main;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRect = canvasRef.current ? canvasRef.current.getBoundingClientRect() : null;

    const [mouseDownPos, setMouseDownPos] = useState<Point | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setMouseDownPos(getCanvasPointFromMouseEvent(e, canvasRect));
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
            });
            console.log({ clickedRegionId });

            setMouseDownPos(null);
        }

        const { current: canvas } = canvasRef;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const mousePos = getCanvasPointFromMouseEvent(e, canvasRect);
        const { current: canvas } = canvasRef;
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

export const NewRegionCanvas = connect(
    createStructuredSelector({
        activeMapRegions: getActiveMapRegions,
    }),
    {
        openNewRegionDialog,
    }
)(NewRegionCanvasBase);
