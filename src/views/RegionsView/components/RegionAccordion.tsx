import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import { FlexBox } from '../../../components';
import { getCurrentProjectMaps, getCurrentProjectRegionsByMap } from '../../../state';
import { RouteName, StoreProps } from '../../../types';
import { useUrlNavigation } from '../../../utils';

const connectRegionAccordion = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
        regionsByMap: getCurrentProjectRegionsByMap,
    })
);

interface RegionAccordionProps extends StoreProps<typeof connectRegionAccordion> {
    root?: boolean;
    expanded?: boolean;
    mapId: string;
    regionId?: string | null;
}

const MAX_DESCRIPTION_LENGTH = 150;

const RegionAccordionBase: React.FC<RegionAccordionProps> = ({
    root,
    expanded,
    maps,
    regionsByMap,
    mapId,
    regionId,
}) => {
    const { setUrlParts } = useUrlNavigation();

    const childrenIds = useMemo(() => {
        if (regionId) {
            return Object.values(maps)
                .filter((map) => map.parentRegionId === regionId)
                .map((map) => ({ mapId: map.id, regionId: null }));
        }

        return Object.values(regionsByMap[mapId]).map((region) => ({ mapId, regionId: region.id }));
    }, [maps, regionsByMap, mapId, regionId]);

    const handleOpenClick = (e: React.MouseEvent) => {
        if (regionId) {
            setUrlParts({ activeMapId: mapId, regionId: regionId });
        } else {
            setUrlParts({ view: RouteName.Map, activeMapId: mapId });
        }

        e.stopPropagation();
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        // TODO: Delete the root map and all child maps and regions
        e.stopPropagation();
    };

    const { name } = regionId ? regionsByMap[mapId][regionId] : maps[mapId];
    let description = regionId ? regionsByMap[mapId][regionId].description : null;
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
        description = `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`;
    }

    return (
        <Accordion expanded={expanded ? true : undefined} sx={{ boxShadow: 'none' }}>
            <AccordionSummary expandIcon={!expanded ? <ExpandMore /> : undefined}>
                <FlexBox fullWidth alignX="space-between" alignY="center">
                    <FlexBox fullWidth column>
                        <Typography variant="h6">
                            {regionId || mapId}. {name}
                        </Typography>
                        {description && <Typography variant="body2">{description}</Typography>}
                    </FlexBox>
                    <FlexBox fullHeight center>
                        {root && (
                            <Button color="error" onClick={handleDeleteClick}>
                                Delete
                            </Button>
                        )}
                        <Button onClick={handleOpenClick}>Open</Button>
                    </FlexBox>
                </FlexBox>
            </AccordionSummary>
            <AccordionDetails>
                {childrenIds.map((childRegion) => (
                    <RegionAccordion
                        key={`${childRegion.mapId}${childRegion.regionId || ''}`}
                        {...childRegion}
                    />
                ))}
            </AccordionDetails>
        </Accordion>
    );
};

export const RegionAccordion = connectRegionAccordion(RegionAccordionBase);
