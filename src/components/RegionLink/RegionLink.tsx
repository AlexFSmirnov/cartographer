import { Box, Link, Tooltip, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { StoreProps } from '../../types';
import { URL_BASENAME } from '../../constants';
import { useUrlNavigation } from '../../hooks';
import { getCurrentProjectMaps, getCurrentProjectRegionsByMap } from '../../state';
import { parseUrl } from '../../utils';
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
    const { getUrlParts, navigate } = useUrlNavigation();
    const { view, subView } = getUrlParts();
    const { activeMap, region } = parseUrl(`/view_placeholder${relativeHref}`);

    const handleClick = (e: React.MouseEvent) => {
        if (isClickable && relativeHref) {
            navigate(`/${view}${region ? `${relativeHref}/${subView}` : relativeHref}`);
        }

        e.preventDefault();
    };

    const href = `${window.location.origin}${URL_BASENAME}/${view}${relativeHref || ''}`;

    let tooltipTitleElement: React.ReactNode = '';

    if (activeMap) {
        const regionId = region || activeMap;
        const { name: regionName } = region ? regions[activeMap][region] : maps[activeMap];

        tooltipTitleElement = (
            <Box
                width="250px"
                height="150px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-around"
            >
                <Typography noWrap fontWeight={500}>
                    {regionId}. {regionName}
                </Typography>
                <Box width="250px" height="100px">
                    <RegionPreview doesRegionExist mapId={activeMap} regionId={region} />
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
