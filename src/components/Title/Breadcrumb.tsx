import { Box, Tooltip, Typography } from '@mui/material';
import { useUrlNavigation } from '../../utils';
import { FlexBox } from '../FlexBox';
import { RegionPreview } from '../RegionPreview';

interface BreadcrumbProps {
    id: string;
    name: string;
    type: 'map' | 'region';
    parentMapId?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ id, name, type, parentMapId }) => {
    const { getHref, setUrlParts } = useUrlNavigation();

    const handleClick = (e: React.MouseEvent) => {
        if (type === 'map') {
            setUrlParts({ activeMapId: id, regionId: null });
        } else if (parentMapId) {
            setUrlParts({ activeMapId: parentMapId, regionId: id });
        }

        e.preventDefault();
    };

    const href =
        type === 'region' && parentMapId
            ? getHref({ activeMapId: parentMapId, regionId: id })
            : getHref({ activeMapId: id, regionId: null });

    let tooltipElement: React.ReactNode = '';
    if (type === 'map' || (type === 'region' && parentMapId)) {
        tooltipElement = (
            <FlexBox width="250px" height="150px" column alignX="center" alignY="space-around">
                <Typography sx={{ maxWidth: '100%' }} noWrap fontWeight={500}>
                    {id}. {name}
                </Typography>
                <Box width="250px" height="100px">
                    {type === 'region' && parentMapId ? (
                        <RegionPreview doesRegionExist mapId={parentMapId} regionId={id} />
                    ) : (
                        <RegionPreview doesRegionExist mapId={id} regionId={null} />
                    )}
                </Box>
            </FlexBox>
        );
    }

    return (
        <a href={href} style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleClick}>
            <Tooltip title={tooltipElement}>
                <Typography variant="h5" sx={{ fontWeight: 300, opacity: 0.7 }}>
                    {id}
                </Typography>
            </Tooltip>
        </a>
    );
};
