import { useEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useTheme } from '@mui/material';
import { Rect, StoreProps } from '../../types';
import { getCurrentProjectRegionsByMap } from '../../state';
import { useImageFromContext } from '../../utils';
import { RegionPreviewContainer } from './style';

const REGION_PADDING = 8;

const connectRegionPreview = connect(
    createStructuredSelector({
        regions: getCurrentProjectRegionsByMap,
    })
);

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

type RegionPreviewProps = OwnProps & StoreProps<typeof connectRegionPreview>;

const RegionPreviewBase: React.FC<RegionPreviewProps> = ({
    doesRegionExist,
    mapImage: mapImageProp,
    regionRect: regionRectProp,
    mapId,
    regionId,
    regions,
}) => {
    const theme = useTheme();

    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        return {
            x: rect.x - REGION_PADDING,
            y: rect.y - REGION_PADDING,
            width: rect.width + REGION_PADDING * 2,
            height: rect.height + REGION_PADDING * 2,
        };
    }, [doesRegionExist, regionId, regions, mapId, mapImage, regionRectProp]);

    const canvasSize = useMemo(
        () => ({
            width: regionRect?.width || 0,
            height: regionRect?.height || 0,
        }),
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

    return (
        <RegionPreviewContainer shadow={theme.shadows[2]}>
            <canvas {...canvasSize} ref={canvasRef} />
        </RegionPreviewContainer>
    );
};

export const RegionPreview = connectRegionPreview(RegionPreviewBase);
