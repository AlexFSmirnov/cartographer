import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from '@mui/material';
import { FlexBox } from '../../../components';
import {
    deleteMapOrRegion,
    getCurrentProjectMaps,
    getCurrentProjectRegionsByMap,
    getIsEditModeEnabled,
} from '../../../state';
import { RouteName, StoreProps } from '../../../types';
import { useImagesContext, useUrlNavigation } from '../../../utils';

const connectRegionAccordion = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
        regionsByMap: getCurrentProjectRegionsByMap,
        isEditModeEnabled: getIsEditModeEnabled,
    }),
    {
        deleteMapOrRegion,
    }
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
    isEditModeEnabled,
    deleteMapOrRegion,
}) => {
    const { setUrlParts } = useUrlNavigation();
    const { deleteImage } = useImagesContext();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
        setIsDeleteDialogOpen(true);
        e.stopPropagation();
    };
    const handleDeleteCancel = () => setIsDeleteDialogOpen(false);
    const handleDeleteConfirm = () => deleteMapOrRegion({ mapId, regionId, deleteImage });

    const { name } = regionId ? regionsByMap[mapId][regionId] : maps[mapId];
    let description = regionId ? regionsByMap[mapId][regionId].description : null;
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
        description = `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`;
    }

    const isExpandable = childrenIds.length > 0 && !expanded;
    const accordionProps = {
        expanded: expanded ? true : isExpandable ? undefined : false,
        sx: {
            boxShadow: 'none',
        },
    };

    return (
        <>
            <Accordion {...accordionProps}>
                <AccordionSummary expandIcon={isExpandable ? <ExpandMore /> : undefined}>
                    <FlexBox fullWidth alignX="space-between" alignY="center">
                        <FlexBox fullWidth column>
                            <Typography variant="h6">
                                {regionId || mapId}. {name}
                            </Typography>
                            {description && <Typography variant="body2">{description}</Typography>}
                        </FlexBox>
                        <FlexBox fullHeight center>
                            {root && isEditModeEnabled && (
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
            <Dialog open={isDeleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Delete map</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {regionId || mapId} ({name})?
                    </DialogContentText>
                    <DialogContentText>
                        This will delete all of its child regions and maps!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={handleDeleteCancel}>
                        Cancel
                    </Button>
                    <Button color="error" onClick={handleDeleteConfirm}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const RegionAccordion = connectRegionAccordion(RegionAccordionBase);
