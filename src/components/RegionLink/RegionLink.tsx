import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, Tooltip } from '@mui/material';
import { URL_BASENAME } from '../../constants';
import { getCurrentProjectMaps, getCurrentProjectRegionsByMap } from '../../state';
import { StoreProps } from '../../types';
import { useUrlNavigation } from '../../utils';
import { RegionPreviewTooltip } from '../RegionPreviewTooltip';

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
        const { name: regionName } = regionId ? regions[activeMapId][regionId] : maps[activeMapId];

        tooltipTitleElement = (
            <RegionPreviewTooltip mapId={activeMapId} regionId={regionId} name={regionName} />
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
