import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useTheme } from '@mui/material';
import { getActiveMapRegions } from '../../../state';
import { Point, Size, StoreProps } from '../../../types';
import {
    drawRichRect,
    getCanvasPointFromMouseEvent,
    getCanvasRectFromImageRect,
    getRegionIdFromCanvasPoint,
    transformRect,
    useUrlNavigation,
} from '../../../utils';
import { ACTIVE_MAP_PADDING } from '../constants';
import { MapViewCanvas } from '../style';
import { CanvasBaseProps } from './types';

const connectRegionSelectCanvas = connect(
    createStructuredSelector({
        activeMapRegions: getActiveMapRegions,
    })
);

interface RegionSelectCanvasProps
    extends StoreProps<typeof connectRegionSelectCanvas>,
        CanvasBaseProps {
    canvasSize: Size;
    activeMapImageSize: Size;
}

const RegionSelectCanvasBase: React.FC<RegionSelectCanvasProps> = ({
    canvasSize,
    activeMapImageSize,
    activeMapRegions,
    scale,
    offset,
}) => {
    const theme = useTheme();

    const { setUrlParts } = useUrlNavigation();

    const [mousePos, setMousePos] = useState<Point | null>(null);

    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const canvasRect = useMemo(
        () => (canvas ? canvas.getBoundingClientRect() : null),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [canvas, setUrlParts]
    );

    const canvasRef = (ref: HTMLCanvasElement | null) => setCanvas(ref);

    useEffect(() => {
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        }
    }, [activeMapRegions, canvasSize, canvas, scale, offset]);

    const getRegionFromMousePos = useCallback(
        (mousePos: Point | null) => {
            if (!mousePos) {
                return null;
            }

            const selectedRegionId = getRegionIdFromCanvasPoint({
                canvasPoint: mousePos,
                regions: activeMapRegions,
                canvasSize,
                imageSize: activeMapImageSize,
                imagePadding: ACTIVE_MAP_PADDING,
                scale,
                offset,
            });

            return selectedRegionId ? activeMapRegions[selectedRegionId] : null;
        },
        [activeMapRegions, canvasSize, activeMapImageSize, scale, offset]
    );

    useEffect(() => {
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const selectedRegion = getRegionFromMousePos(mousePos);
        if (selectedRegion) {
            const { parentRect, id, name } = selectedRegion;

            const regionCanvasRect = getCanvasRectFromImageRect({
                imageRect: parentRect,
                imageSize: activeMapImageSize,
                canvasSize,
                imagePadding: ACTIVE_MAP_PADDING,
            });

            const rect = transformRect({
                rect: regionCanvasRect,
                containerSize: canvasSize,
                scale,
                offset,
            });

            drawRichRect({
                ctx,
                rect,
                subtitle: `${id}. ${name}`,
                strokeColor: theme.palette.primary.main,
                contrastColor: theme.palette.primary.contrastText,
            });
        }
    }, [
        mousePos,
        canvas,
        canvasSize,
        activeMapImageSize,
        scale,
        offset,
        theme,
        getRegionFromMousePos,
    ]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const mousePos = getCanvasPointFromMouseEvent(e, canvasRect);
        setMousePos(mousePos);
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const mousePos = getCanvasPointFromMouseEvent(e, canvasRect);
        const selectedRegion = getRegionFromMousePos(mousePos);

        if (selectedRegion) {
            setUrlParts({ regionId: selectedRegion.id });
        }
    };

    const canvasProps = {
        ...canvasSize,
        ref: canvasRef,
        onMouseMove: handleMouseMove,
        onClick: handleClick,
    };

    return <MapViewCanvas {...canvasProps} />;
};

export const RegionSelectCanvas = connectRegionSelectCanvas(RegionSelectCanvasBase);
