import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useImageFromDataUrl } from '../../hooks';
import { getActiveMapImageDataUrl } from '../../state';
import { ActiveMapCanvas, NewRegionCanvas, NewRegionDialog } from './components';
import { MapViewContainer } from './style';

interface StateProps {
    activeMapImageDataUrl: string | null;
}

type MapViewProps = StateProps;

const MapViewBase: React.FC<MapViewProps> = ({ activeMapImageDataUrl }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const activeMapImage = useImageFromDataUrl(activeMapImageDataUrl);

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

    const activeMapImageSize = {
        width: activeMapImage?.width || 0,
        height: activeMapImage?.height || 0,
    };

    return (
        <>
            <MapViewContainer ref={containerRef}>
                <ActiveMapCanvas canvasSize={canvasSize} activeMapImage={activeMapImage} />
                <NewRegionCanvas canvasSize={canvasSize} activeMapImageSize={activeMapImageSize} />
            </MapViewContainer>
            <NewRegionDialog activeMapImage={activeMapImage} />
        </>
    );
};

export const MapView = connect(
    createStructuredSelector({
        activeMapImageDataUrl: getActiveMapImageDataUrl,
    })
)(MapViewBase);
