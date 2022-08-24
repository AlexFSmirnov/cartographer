import { Box, Typography } from '@mui/material';
import { FlexBox } from '../FlexBox';
import { RegionPreview } from '../RegionPreview';

interface RegionPreviewTooltipProps {
    mapId: string;
    regionId?: string | null;
    name: string;
}

export const RegionPreviewTooltip: React.FC<RegionPreviewTooltipProps> = ({
    mapId,
    regionId,
    name,
}) => (
    <FlexBox width="250px" height="150px" column alignX="center" alignY="space-around">
        <Typography sx={{ maxWidth: '100%' }} noWrap fontWeight={500}>
            {regionId || mapId}. {name}
        </Typography>
        <Box width="250px" height="100px">
            <RegionPreview
                doesRegionExist
                mapId={mapId}
                regionId={regionId || null}
                containerSize={{ width: 250, height: 100 }}
            />
        </Box>
    </FlexBox>
);
