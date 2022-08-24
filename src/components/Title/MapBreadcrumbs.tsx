import { useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ArrowDropDown } from '@mui/icons-material';
import { ListItem, Popover, Typography } from '@mui/material';
import { getCurrentProjectMaps, getCurrentProjectRegionsByMap } from '../../state';
import { StoreProps } from '../../types';
import { getParentChain, getSiblingMaps, useUrlNavigation } from '../../utils';
import { FlexBox } from '../FlexBox';
import { Breadcrumb } from './Breadcrumb';

const connectMapBreadcrumbs = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
        regionsByMap: getCurrentProjectRegionsByMap,
    })
);

interface MapBreadcrumbsProps extends StoreProps<typeof connectMapBreadcrumbs> {
    mapId: string | null;
}

const MapBreadcrumbsBase: React.FC<MapBreadcrumbsProps> = ({ mapId, maps, regionsByMap }) => {
    const { setUrlParts } = useUrlNavigation();

    const [isMapSelectOpen, setIsMapSelectOpen] = useState(false);
    const mapSelectAnchorRef = useRef<HTMLDivElement>(null);

    const map = useMemo(() => mapId !== null && maps[mapId], [mapId, maps]);
    const breadcrumbs = useMemo(() => {
        if (!map) {
            return [];
        }

        return getParentChain({ map, maps, regionsByMap });
    }, [map, maps, regionsByMap]);

    const siblingMaps = useMemo(() => {
        if (!map) {
            return [];
        }

        return getSiblingMaps({ map, maps });
    }, [map, maps]);

    const closeMapSelect = () => setIsMapSelectOpen(false);
    const openMapSelect = () => {
        if (siblingMaps.length > 0) {
            setIsMapSelectOpen(!isMapSelectOpen);
        }
    };

    const handleSiblingMapClick = (mapId: string) => () => {
        closeMapSelect();
        setUrlParts({ activeMapId: mapId });
    };

    if (!map) {
        return null;
    }

    return (
        <>
            <FlexBox fullHeight fullWidth column center>
                <FlexBox>
                    {breadcrumbs.map((breadcrumb) => (
                        <FlexBox key={`${breadcrumb.id}-${breadcrumb.type}`}>
                            <Breadcrumb {...breadcrumb} />
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 300, padding: '0 8px', opacity: 0.7 }}
                            >
                                /
                            </Typography>
                        </FlexBox>
                    ))}
                    <FlexBox
                        center
                        sx={{ cursor: siblingMaps.length > 0 ? 'pointer' : 'default' }}
                        onClick={openMapSelect}
                        ref={mapSelectAnchorRef}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 300 }}>
                            {map.id}
                        </Typography>
                        {siblingMaps.length > 0 && (
                            <ArrowDropDown
                                sx={{
                                    transform: isMapSelectOpen ? 'rotate(-180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s',
                                }}
                            />
                        )}
                    </FlexBox>
                </FlexBox>
                <Typography variant="h5" sx={{ fontWeight: 300 }}>
                    {map.name}
                </Typography>
            </FlexBox>
            <Popover
                open={isMapSelectOpen}
                anchorEl={mapSelectAnchorRef.current}
                onClose={closeMapSelect}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <FlexBox column width="300px">
                    {siblingMaps.map((siblingMap, index) => (
                        <ListItem
                            key={siblingMap.id}
                            button
                            onClick={handleSiblingMapClick(siblingMap.id)}
                            divider={index < siblingMaps.length - 1}
                        >
                            <Typography noWrap>
                                {siblingMap.id}. {siblingMap.name}
                            </Typography>
                        </ListItem>
                    ))}
                </FlexBox>
            </Popover>
        </>
    );
};

export const MapBreadcrumbs = connectMapBreadcrumbs(MapBreadcrumbsBase);
