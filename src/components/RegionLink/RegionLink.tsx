import { Box, Link, Tooltip, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { StoreProps } from '../../types';
import { URL_BASENAME } from '../../constants';
import { getCurrentProjectMaps, getCurrentProjectRegionsByMap } from '../../state';
import { useUrlNavigation } from '../../utils';
import { RegionPreview } from '../RegionPreview';

const connectRegionLink = connect(
    createStructuredSelector({
        regions: getCurrentProjectRegionsByMap,
        maps: getCurrentProjectMaps,
    })
);

interface RegionLinkProps extends StoreProps<typeof connectRegionLink> {
    relativeHref?: string;
    isClickable?: boolean;
    children: React.ReactNode;
}

const RegionLinkBase: React.FC<RegionLinkProps> = ({
    relativeHref,
    isClickable,
    children,
    regions,
    maps,
}) => {
    const { getUrlParts, navigate, parseUrl } = useUrlNavigation();
    const { view, subView } = getUrlParts();
    const { activeMapId, regionId } = parseUrl(`/view_placeholder${relativeHref}`);

    const handleClick = (e: React.MouseEvent) => {
        if (isClickable && relativeHref) {
            navigate(`/${view}${regionId ? `${relativeHref}/${subView}` : relativeHref}`);
        }

        e.preventDefault();
    };

    const href = `${window.location.origin}${URL_BASENAME}/${view}${relativeHref || ''}`;

    let tooltipTitleElement: React.ReactNode = '';

    if (activeMapId) {
        const regionOrMapId = regionId || activeMapId;
        const { name: regionName } = regionId ? regions[activeMapId][regionId] : maps[activeMapId];

        tooltipTitleElement = (
            <Box
                width="250px"
                height="150px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-around"
            >
                <Typography sx={{ maxWidth: '100%' }} noWrap fontWeight={500}>
                    {regionOrMapId}. {regionName}
                </Typography>
                <Box width="250px" height="100px">
                    <RegionPreview doesRegionExist mapId={activeMapId} regionId={regionId} />
                </Box>
            </Box>
        );
    }

    return (
        <>
            <Tooltip title={tooltipTitleElement}>
                <Link href={href} onClick={handleClick}>
                    {children}
                </Link>
            </Tooltip>
        </>
    );
};

export const RegionLink = connectRegionLink(RegionLinkBase);
