import { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { CircularProgress, useTheme } from '@mui/material';
import { getCurrentProjectRegionsByMap } from '../../state';
import { Rect, Size, StoreProps } from '../../types';
import { getImageCoverRect, useImageFromContext } from '../../utils';
import { RegionPreviewContainer, RegionPreviewLoaderContainer } from './style';

const REGION_PADDING = 0.1;

const connectRegionPreview = connect(
    createStructuredSelector({
        regions: getCurrentProjectRegionsByMap,
    })
);

interface BaseOwnProps {
    doesRegionExist: boolean;
    containerSize?: Size;

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

type RegionPreviewProps = OwnProps & StoreProps<typeof connectRegionPreview>;

const RegionPreviewBase: React.FC<RegionPreviewProps> = ({
    doesRegionExist,
    containerSize,
    mapImage: mapImageProp,
    regionRect: regionRectProp,
    mapId,
    regionId,
    regions,
}) => {
    const theme = useTheme();

    const [isImageDrawn, setIsImageDrawn] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const ownMapImage = useImageFromContext(doesRegionExist ? mapId : null);

    const mapImage = useMemo(
        () => (doesRegionExist ? ownMapImage : mapImageProp),
        [doesRegionExist, mapImageProp, ownMapImage]
    );

    const regionRect = useMemo(() => {
        let rect = null;
        if (doesRegionExist) {
            if (regionId) {
                rect = regions[mapId]?.[regionId]?.parentRect || null;
            } else if (mapImage) {
                rect = {
                    x: 0,
                    y: 0,
                    width: mapImage.width,
                    height: mapImage.height,
                };
            }
        } else {
            rect = regionRectProp;
        }

        if (!rect) return null;

        if (doesRegionExist && !regionId) {
            return rect;
        }

        const padding = Math.max(rect.width, rect.height) * REGION_PADDING;

        return {
            x: rect.x - padding,
            y: rect.y - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
        };
    }, [doesRegionExist, regionId, regions, mapId, mapImage, regionRectProp]);

    const canvasSize = useMemo(() => {
        const { current: container } = containerRef;

        if (!regionRect) {
            return { width: 0, height: 0 };
        }

        if (!container || !containerSize) {
            return regionRect;
        }

        const { width: containerWidth, height: containerHeight } = containerSize
            ? containerSize
            : container.getBoundingClientRect();

        const { width, height } = getImageCoverRect({
            imageWidth: regionRect.width,
            imageHeight: regionRect.height,
            containerWidth,
            containerHeight,
            padding: 0,
        });

        return { width, height };
    }, [regionRect, containerRef, containerSize]);

    useEffect(() => {
        const { current: canvas } = canvasRef;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !regionRect || !mapImage) {
            return;
        }

        setIsImageDrawn(false);
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
        setIsImageDrawn(true);
    }, [canvasSize, regionRect, mapImage]);

    const canvasProps = {
        ...canvasSize,
        ref: canvasRef,
        style: {
            opacity: isImageDrawn ? 1 : 0,
        },
    };

    return (
        <RegionPreviewContainer shadow={theme.shadows[2]} ref={containerRef}>
            {!isImageDrawn && (
                <RegionPreviewLoaderContainer>
                    <CircularProgress />
                </RegionPreviewLoaderContainer>
            )}
            <canvas {...canvasProps} />
        </RegionPreviewContainer>
    );
};

export const RegionPreview = connectRegionPreview(RegionPreviewBase);
