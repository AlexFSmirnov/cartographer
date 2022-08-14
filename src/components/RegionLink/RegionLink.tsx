import { Box, Link, Tooltip, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { URL_BASENAME } from '../../constants';
import { useUrlNavigation } from '../../hooks';
import { getCurrentProjectMaps, getCurrentProjectRegionsByMap } from '../../state';
import { parseUrl } from '../../utils';
import { RegionPreview } from '../RegionPreview';

interface OwnProps {
    relativeHref?: string;
    isClickable?: boolean;
    children: React.ReactNode;
}

interface StateProps {
    maps: ReturnType<typeof getCurrentProjectMaps>;
    regions: ReturnType<typeof getCurrentProjectRegionsByMap>;
}

type RegionLinkProps = OwnProps & StateProps;

const RegionLinkBase: React.FC<RegionLinkProps> = ({
    relativeHref,
    isClickable,
    children,
    regions,
    maps,
}) => {
    const { getUrlParts, navigate } = useUrlNavigation();
    const { view } = getUrlParts();
    const { activeMap, region } = parseUrl(`/view_placeholder${relativeHref}`);

    const handleClick = (e: React.MouseEvent) => {
        if (isClickable) {
            navigate(`/${view}${relativeHref || ''}`);
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

export const RegionLink = connect(
    createStructuredSelector({
        regions: getCurrentProjectRegionsByMap,
        maps: getCurrentProjectMaps,
    })
)(RegionLinkBase);
