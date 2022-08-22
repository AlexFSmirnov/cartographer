import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useTheme } from '@mui/material';
import { getActiveMapRegions } from '../../../state';
import { Size, StoreProps } from '../../../types';
import {
    drawRichRect,
    getCanvasPointFromMouseEvent,
    getCanvasRectFromImageRect,
    getRegionIdFromCanvasPoint,
    useUrlNavigation,
} from '../../../utils';
import { ACTIVE_MAP_PADDING } from '../constants';
import { MapViewCanvas } from '../style';

const connectRegionSelectCanvas = connect(
    createStructuredSelector({
        activeMapRegions: getActiveMapRegions,
    })
);

interface RegionSelectCanvasProps extends StoreProps<typeof connectRegionSelectCanvas> {
    canvasSize: Size;
    activeMapImageSize: Size;
}

const RegionSelectCanvasBase: React.FC<RegionSelectCanvasProps> = ({
    canvasSize,
    activeMapImageSize,
    activeMapRegions,
}) => {
    const theme = useTheme();
    const strokeColor = theme.palette.primary.main;
    const contrastColor = theme.palette.primary.contrastText;

    const { setUrlParts } = useUrlNavigation();

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
    }, [activeMapRegions, canvasSize, canvas]);

    const getRegionFromMouseEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const mousePos = getCanvasPointFromMouseEvent(e, canvasRect);

        if (!mousePos) {
            return null;
        }

        const selectedRegionId = getRegionIdFromCanvasPoint({
            canvasPoint: mousePos,
            regions: activeMapRegions,
            canvasSize,
            imageSize: activeMapImageSize,
            imagePadding: ACTIVE_MAP_PADDING,
        });

        return selectedRegionId ? activeMapRegions[selectedRegionId] : null;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const selectedRegion = getRegionFromMouseEvent(e);
        if (selectedRegion) {
            const { parentRect, id, name } = selectedRegion;

            const regionCanvasRect = getCanvasRectFromImageRect({
                imageRect: parentRect,
                imageSize: activeMapImageSize,
                canvasSize,
                imagePadding: ACTIVE_MAP_PADDING,
            });

            drawRichRect({
                ctx,
                rect: regionCanvasRect,
                subtitle: `${id}. ${name}`,
                strokeColor,
                contrastColor,
            });
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const selectedRegion = getRegionFromMouseEvent(e);

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
