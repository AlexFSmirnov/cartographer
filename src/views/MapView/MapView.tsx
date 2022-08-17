import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { StoreProps } from '../../types';
import { useImageFromDataUrl } from '../../utils';
import { getActiveMapImageDataUrl, getIsEditModeEnabled } from '../../state';
import {
    ActiveMapCanvas,
    AllRegionsCanvas,
    NewRegionCanvas,
    NewRegionDialog,
    RegionSelectCanvas,
} from './components';
import { MapViewContainer } from './style';

const connectMapView = connect(
    createStructuredSelector({
        isEditModeEnabled: getIsEditModeEnabled,
        activeMapImageDataUrl: getActiveMapImageDataUrl,
    })
);

type MapViewProps = StoreProps<typeof connectMapView>;

const MapViewBase: React.FC<MapViewProps> = ({ isEditModeEnabled, activeMapImageDataUrl }) => {
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

    const regionCanvasBaseProps = { canvasSize, activeMapImageSize };

    return (
        <>
            <MapViewContainer ref={containerRef}>
                <ActiveMapCanvas canvasSize={canvasSize} activeMapImage={activeMapImage} />
                {isEditModeEnabled && <AllRegionsCanvas {...regionCanvasBaseProps} />}
                {isEditModeEnabled && <NewRegionCanvas {...regionCanvasBaseProps} />}
                {!isEditModeEnabled && <RegionSelectCanvas {...regionCanvasBaseProps} />}
            </MapViewContainer>
            <NewRegionDialog activeMapImage={activeMapImage} />
        </>
    );
};

export const MapView = connectMapView(MapViewBase);
