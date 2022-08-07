import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseUrl, getImageCoverRect } from '../../utils';
import {
    getActiveMapImageDataUrl,
    getCurrentProjectRegionIds,
    getIsEditModeEnabled,
} from '../../state';
import { MapViewCanvas, MapViewContainer } from './style';
import { Point } from '../../types';
import { ActiveMapCanvas, NewRegionCanvas, NewRegionDialog } from './components';

interface StateProps {
    isEditModeEnabled: boolean;
    currentProjectRegionIds: string[];
    activeMapImageDataUrl: string | null;
}

type MapViewProps = StateProps;

const MapViewBase: React.FC<MapViewProps> = ({
    isEditModeEnabled,
    currentProjectRegionIds,
    activeMapImageDataUrl,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { view, activeMap, region, subView } = parseUrl(location.pathname);

    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [isActiveMapImageLoaded, setIsActiveMapImageLoaded] = useState(false);

    const activeMapImage = useMemo(() => {
        if (!activeMapImageDataUrl) {
            return null;
        }

        const image = new Image();
        image.src = activeMapImageDataUrl;
        setIsActiveMapImageLoaded(false);
        image.onload = () => setIsActiveMapImageLoaded(true);

        return image;
    }, [activeMapImageDataUrl]);

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

    console.log('RENDERED');

    const loadedActiveMapImage = isActiveMapImageLoaded ? activeMapImage : null;
    const activeMapImageSize = {
        width: activeMapImage?.width || 0,
        height: activeMapImage?.height || 0,
    };

    return (
        <>
            <MapViewContainer ref={containerRef}>
                <ActiveMapCanvas canvasSize={canvasSize} activeMapImage={loadedActiveMapImage} />
                <NewRegionCanvas canvasSize={canvasSize} activeMapImageSize={activeMapImageSize} />
            </MapViewContainer>
            <NewRegionDialog activeMapImage={loadedActiveMapImage} />
        </>
    );
};

export const MapView = connect(
    createStructuredSelector({
        isEditModeEnabled: getIsEditModeEnabled,
        currentProjectRegionIds: getCurrentProjectRegionIds,
        activeMapImageDataUrl: getActiveMapImageDataUrl,
    })
)(MapViewBase);
