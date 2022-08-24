import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box } from '@mui/material';
import { FlexBox } from '../../components';
import { getIsEditModeEnabled } from '../../state';
import { Point, StoreProps } from '../../types';
import { useImageFromContext, useUrlNavigation } from '../../utils';
import {
    ActiveMapCanvas,
    AllRegionsCanvas,
    NewRegionCanvas,
    NewRegionDialog,
    RegionSelectCanvas,
} from './components';
import { SiblingMapSelect } from './components/SiblingMapSelect';
import { MapViewContainer } from './style';

const connectMapView = connect(
    createStructuredSelector({
        isEditModeEnabled: getIsEditModeEnabled,
    })
);

type MapViewProps = StoreProps<typeof connectMapView>;

const MapViewBase: React.FC<MapViewProps> = ({ isEditModeEnabled }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const [canvasScale, setCanvasScale] = useState(1);
    const [canvasOffset, setCanvasOffset] = useState<Point>({ x: 0, y: 0 });
    const [prevMousePoint, setPrevMousePoint] = useState<Point | null>(null);

    const { getUrlParts } = useUrlNavigation();
    const { activeMapId } = getUrlParts();

    const activeMapImage = useImageFromContext(activeMapId);

    const updateCanvasSize = useCallback(() => {
        const { current: container } = containerRef;
        if (container) {
            const { width, height } = container.getBoundingClientRect();

            if (
                Math.abs(width - canvasSize.width) > 0.1 ||
                Math.abs(height - canvasSize.height) > 0.1
            ) {
                setCanvasSize({ width, height });
            }
        }
    }, [containerRef, canvasSize]);

    useEffect(updateCanvasSize, [updateCanvasSize]);

    useEffect(() => {
        const { current: container } = containerRef;
        if (!container) {
            return;
        }

        const resizeObserver = new ResizeObserver(updateCanvasSize);
        resizeObserver.observe(container);

        return () => resizeObserver.unobserve(container);
    });

    const getClampedOffset = (offset: Point) => {
        const maxOffsetX = (canvasSize.width * (canvasScale - 1)) / 2;
        const maxOffsetY = (canvasSize.height * (canvasScale - 1)) / 2;

        return {
            x: Math.min(Math.max(-maxOffsetX, offset.x), maxOffsetX),
            y: Math.min(Math.max(-maxOffsetY, offset.y), maxOffsetY),
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button === 1) {
            setPrevMousePoint({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => setPrevMousePoint(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!prevMousePoint) {
            return;
        }

        const deltaX = e.clientX - prevMousePoint.x;
        const deltaY = e.clientY - prevMousePoint.y;

        const newOffset = getClampedOffset({
            x: canvasOffset.x + deltaX,
            y: canvasOffset.y + deltaY,
        });

        setCanvasOffset(newOffset);
        setPrevMousePoint({ x: e.clientX, y: e.clientY });
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (e?.deltaY) {
            const scaleMultiplier = e.deltaY > 0 ? 0.9 : 1.1;

            // Yeah, not proud of this, but it works 😅
            const { current: container } = containerRef;
            if (container) {
                const { top, left } = container.getBoundingClientRect();

                // Mouse position relative to the visible part of the canvas.
                const viewportCanvasMousePos = {
                    x: e.clientX - left,
                    y: e.clientY - top,
                };

                // Mouse position relative to the whole canvas.
                const globalCanvasMousePos = {
                    x:
                        viewportCanvasMousePos.x +
                        (canvasSize.width * (scaleMultiplier - 1)) / 2 +
                        canvasOffset.x * scaleMultiplier,
                    y:
                        viewportCanvasMousePos.y +
                        (canvasSize.height * (scaleMultiplier - 1)) / 2 +
                        canvasOffset.y * scaleMultiplier,
                };

                // Viewport mouse position, after transforming into the global canvas coordinates.
                const scaledViewportCanvasMousePos = {
                    x: viewportCanvasMousePos.x * scaleMultiplier + canvasOffset.x,
                    y: viewportCanvasMousePos.y * scaleMultiplier + canvasOffset.y,
                };

                // We want to align the actual and scaled mouse positions, relative to the whole canvas.
                const newOffset = getClampedOffset({
                    x: canvasOffset.x + globalCanvasMousePos.x - scaledViewportCanvasMousePos.x,
                    y: canvasOffset.y + globalCanvasMousePos.y - scaledViewportCanvasMousePos.y,
                });

                setCanvasOffset(newOffset);
            }
            setCanvasScale(Math.max(1, canvasScale * scaleMultiplier));
        }
    };

    const activeMapImageSize = {
        width: activeMapImage?.width || 0,
        height: activeMapImage?.height || 0,
    };

    const containerProps = {
        ref: containerRef,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        onMouseMove: handleMouseMove,
        onWheel: handleWheel,
    };

    const canvasBaseProps = { scale: canvasScale, offset: canvasOffset };
    const regionCanvasBaseProps = { ...canvasBaseProps, canvasSize, activeMapImageSize };

    const activeMapCanvasProps = { ...canvasBaseProps, canvasSize, activeMapImage };

    return (
        <>
            <FlexBox fullWidth fullHeight column>
                <MapViewContainer {...containerProps}>
                    <ActiveMapCanvas {...activeMapCanvasProps} />
                    {isEditModeEnabled && <AllRegionsCanvas {...regionCanvasBaseProps} />}
                    {isEditModeEnabled && <NewRegionCanvas {...regionCanvasBaseProps} />}
                    {!isEditModeEnabled && <RegionSelectCanvas {...regionCanvasBaseProps} />}
                    {!isEditModeEnabled && <SiblingMapSelect />}
                </MapViewContainer>
                <Box height="64px" />
            </FlexBox>
            <NewRegionDialog activeMapImage={activeMapImage} />
        </>
    );
};

export const MapView = connectMapView(MapViewBase);
