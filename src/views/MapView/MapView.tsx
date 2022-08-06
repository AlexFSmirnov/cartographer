import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseUrl } from '../../utils';
import { getActiveMapImageDataUrl, getCurrentProjectRegionIds } from '../../state';
import { EmptyProjectView } from '../EmptyProjectView';
import { NotFound } from '../NotFound';
import { MapViewCanvas, MapViewContainer } from './style';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface StateProps {
    currentProjectRegionIds: string[];
    activeMapImageDataUrl: string | null;
}

type MapViewProps = StateProps;

const MapViewBase: React.FC<MapViewProps> = ({
    currentProjectRegionIds,
    activeMapImageDataUrl,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { view, activeMap, region, subView } = parseUrl(location.pathname);

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [isActiveMapImageLoaded, setIsActiveMapImageLoaded] = useState(false);

    const activeMapImage = useMemo(() => {
        if (!activeMapImageDataUrl) {
            return null;
        }

        const image = new Image();
        image.src = activeMapImageDataUrl;
        image.onload = () => setIsActiveMapImageLoaded(true);

        return image;
    }, [activeMapImageDataUrl]);

    useEffect(() => {
        const { current: container } = containerRef;
        if (container) {
            const { width, height } = container.getBoundingClientRect();
            setCanvasSize({ width, height });
        }
    }, [containerRef]);

    const drawBaseImage = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            if (!activeMapImage || !isActiveMapImageLoaded) {
                return;
            }

            const { width: imageWidth, height: imageHeight } = activeMapImage;
            const { width: canvasWidth, height: canvasHeight } = canvasSize;

            console.log({ imageWidth, imageHeight });
            console.log({ canvasWidth, canvasHeight });

            ctx.drawImage(activeMapImage, 0, 0, 100, 100);
        },
        [activeMapImage, isActiveMapImageLoaded, canvasSize]
    );

    useEffect(() => {
        const { width, height } = canvasSize;
        const { current: canvas } = canvasRef;
        const ctx = canvas?.getContext('2d');
        if (width === 0 || height === 0 || !canvas || !ctx) {
            return;
        }

        ctx.fillStyle = '#000';
        ctx.rect(10, 10, 40, 40);

        ctx.fill();

        drawBaseImage(ctx);
    }, [canvasSize, drawBaseImage]);

    return (
        <MapViewContainer ref={containerRef}>
            <MapViewCanvas ref={canvasRef} {...canvasSize} />
        </MapViewContainer>
    );
};

export const MapView = connect(
    createStructuredSelector({
        currentProjectRegionIds: getCurrentProjectRegionIds,
        activeMapImageDataUrl: getActiveMapImageDataUrl,
    })
)(MapViewBase);
