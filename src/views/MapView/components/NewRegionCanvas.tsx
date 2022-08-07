import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Point } from '../../../types';
import { drawRichRect, getCanvasCoords, getRectFromMousePositions } from '../utils';
import { MapViewCanvas } from '../style';
import { useTheme } from '@mui/material';
import { openNewRegionDialog } from '../../../state';

interface OwnProps {
    canvasSize: { width: number; height: number };
}

interface StateProps {}

interface DispatchProps {
    openNewRegionDialog: typeof openNewRegionDialog;
}

type NewRegionCanvasProps = OwnProps & StateProps & DispatchProps;

const NewRegionCanvasBase: React.FC<NewRegionCanvasProps> = ({
    canvasSize,
    openNewRegionDialog,
}) => {
    const theme = useTheme();
    const strokeColor = theme.palette.primary.main;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRect = canvasRef.current ? canvasRef.current.getBoundingClientRect() : null;

    const [mouseDownPos, setMouseDownPos] = useState<Point | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setMouseDownPos(getCanvasCoords(e, canvasRect));
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const mousePos = getCanvasCoords(e, canvasRect);

        if (!mouseDownPos || !mousePos) {
            return;
        }

        const rect = getRectFromMousePositions(mouseDownPos, mousePos);

        openNewRegionDialog(rect);
        setMouseDownPos(null);

        const { current: canvas } = canvasRef;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const mousePos = getCanvasCoords(e, canvasRect);
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
