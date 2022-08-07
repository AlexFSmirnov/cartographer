import { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getActiveMapImageDataUrl } from '../../../state';
import { getImageCoverRect } from '../../../utils';
import { MapViewCanvas } from '../style';

interface OwnProps {
    canvasSize: { width: number; height: number };
}

interface StateProps {
    activeMapImageDataUrl: string | null;
}

type ActiveMapCanvasProps = OwnProps & StateProps;

const ActiveMapCanvasBase: React.FC<ActiveMapCanvasProps> = ({
    canvasSize,
    activeMapImageDataUrl,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        const { current: canvas } = canvasRef;
        const ctx = canvas?.getContext('2d');

        if (!activeMapImage || !isActiveMapImageLoaded || !canvas || !ctx) {
            return;
        }

        const { width: imageWidth, height: imageHeight } = activeMapImage;
        const { width: containerWidth, height: containerHeight } = canvasSize;

        const { x, y, width, height } = getImageCoverRect({
            imageWidth,
            imageHeight,
            containerWidth,
            containerHeight,
            padding: 8,
        });

        ctx.drawImage(activeMapImage, x, y, width, height);
    }, [activeMapImage, isActiveMapImageLoaded, canvasSize, canvasRef]);

    return <MapViewCanvas ref={canvasRef} {...canvasSize} />;
};

export const ActiveMapCanvas = connect(
    createStructuredSelector({
        activeMapImageDataUrl: getActiveMapImageDataUrl,
    })
)(ActiveMapCanvasBase);
