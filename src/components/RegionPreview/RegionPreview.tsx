import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@mui/material';
import { Rect } from '../../types';
import { getImageCoverRect } from '../../utils';
import { RegionPreviewContainer } from './style';
import { getCurrentProjectRegionsByMap, getImagesSlice } from '../../state';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useImageFromDataUrl } from '../../hooks';

interface BaseOwnProps {
    doesRegionExist: boolean;
    mapId?: string;
    regionId?: string | null;
    mapImage?: HTMLImageElement | null;
    regionRect?: Rect | null;
}

interface OwnProps1 extends BaseOwnProps {
    doesRegionExist: true;
    mapId: string;
    regionId: string | null;
}

interface OwnProps2 extends BaseOwnProps {
    doesRegionExist: false;
    mapImage: HTMLImageElement | null;
    regionRect: Rect | null;
}

type OwnProps = OwnProps1 | OwnProps2;

interface StateProps {
    images: ReturnType<typeof getImagesSlice>;
    regions: ReturnType<typeof getCurrentProjectRegionsByMap>;
}

type RegionPreviewProps = OwnProps & StateProps;

const RegionPreviewBase: React.FC<RegionPreviewProps> = ({
    doesRegionExist,
    mapImage: mapImageProp,
    regionRect: regionRectProp,
    mapId,
    regionId,
    images,
    regions,
}) => {
    const theme = useTheme();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const ownMapImageDataUrl = useMemo(
        () => (doesRegionExist ? images[mapId] : null),
        [images, mapId, doesRegionExist]
    );
    const ownMapImage = useImageFromDataUrl(ownMapImageDataUrl);

    const mapImage = useMemo(
        () => (doesRegionExist ? ownMapImage : mapImageProp),
        [doesRegionExist, mapImageProp, ownMapImage]
    );

    const regionRect = useMemo(() => {
        if (doesRegionExist) {
            return regionId ? regions[mapId][regionId].parentRect : null;
        }

        return regionRectProp;
    }, [doesRegionExist, regionId, regions, mapId, regionRectProp]);

    const containerRef = useCallback(
        (container: HTMLDivElement | null) => {
            if (!container || !regionRect) {
                return;
            }

            const containerRect = container.getBoundingClientRect();

            const { width, height } = getImageCoverRect({
                imageWidth: regionRect.width,
                imageHeight: regionRect.height,
                containerWidth: containerRect.width,
                containerHeight: containerRect.height,
                padding: 0,
            });
            console.log({ regionRect, containerRect, width, height });

            setCanvasSize({ width, height });
        },
        [regionRect]
    );

    useEffect(() => {
        const { current: canvas } = canvasRef;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !regionRect || !mapImage) {
            return;
        }

        ctx.drawImage(
            mapImage,
            regionRect.x,
            regionRect.y,
            regionRect.width,
            regionRect.height,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }, [canvasSize, regionRect, mapImage]);

    const containerProps = {
        shadow: theme.shadows[2],
        ref: containerRef,
    };

    return (
        <RegionPreviewContainer {...containerProps}>
            {!regionId && ownMapImageDataUrl ? (
                <img
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                    src={ownMapImageDataUrl}
                    alt="Region preview"
                />
            ) : (
                <canvas {...canvasSize} ref={canvasRef} />
            )}
        </RegionPreviewContainer>
    );
};

export const RegionPreview = connect(
    createStructuredSelector({
        images: getImagesSlice,
        regions: getCurrentProjectRegionsByMap,
    })
)(RegionPreviewBase);
