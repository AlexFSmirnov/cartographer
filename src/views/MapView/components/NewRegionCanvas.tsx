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
import { openNewRegionDialog } from '../../../state';
import { MapViewCanvas } from '../style';
import { ACTIVE_MAP_PADDING } from '../constants';

interface OwnProps {
    canvasSize: { width: number; height: number };
    activeMapImageSize: { width: number; height: number };
}

interface DispatchProps {
    openNewRegionDialog: typeof openNewRegionDialog;
}

type NewRegionCanvasProps = OwnProps & DispatchProps;

const NewRegionCanvasBase: React.FC<NewRegionCanvasProps> = ({
    canvasSize,
    activeMapImageSize,
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
        const imageRect = getImageRectFromCanvasRect({
            canvasRect: rect,
            canvasSize,
            imageSize: activeMapImageSize,
            imagePadding: ACTIVE_MAP_PADDING,
        });

        openNewRegionDialog(imageRect);
        setMouseDownPos(null);

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

export const NewRegionCanvas = connect(null, {
    openNewRegionDialog,
})(NewRegionCanvasBase);
