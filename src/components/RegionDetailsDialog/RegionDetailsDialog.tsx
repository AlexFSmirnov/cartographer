import { Delete } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tab,
    Tabs,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { SubView } from '../../enums';
import { Region, StoreProps } from '../../types';
import { useUrlNavigation } from '../../hooks';
import { deleteRegion, getCurrentProjectRegionsByMap, getIsEditModeEnabled } from '../../state';
import { RegionDescription } from '../RegionDescription';
import { RegionPreview } from '../RegionPreview';
import { MapsPage, NotesPage, NotFoundPage } from './pages';
import {
    RegionDetailsDialogContent,
    RegionDetailsDialogRegionPreview,
    RegionDetailsDialogTitle,
} from './style';

const connectRegionDetailsDialog = connect(
    createStructuredSelector({
        isEditModeEnabled: getIsEditModeEnabled,
        regionsByMap: getCurrentProjectRegionsByMap,
    }),
    {
        deleteRegion,
    }
);

type RegionDetailsDialogProps = StoreProps<typeof connectRegionDetailsDialog>;

const SUB_VIEW_ORDER = [SubView.Description, SubView.Maps, SubView.Notes, SubView.References];

const RegionDetailsDialogBase: React.FC<RegionDetailsDialogProps> = ({
    isEditModeEnabled,
    regionsByMap,
    deleteRegion,
}) => {
    const { setView, setSubView, getUrlParts } = useUrlNavigation();
    const { view, activeMapId, regionId, subView } = getUrlParts();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [region, setRegion] = useState<Region | null>(null);
    useEffect(() => {
        const region = activeMapId && regionId ? regionsByMap[activeMapId][regionId] : null;
        if (regionId && region) {
            setRegion(region);
        }
    }, [regionsByMap, activeMapId, regionId, setRegion]);

    const tabValue = useMemo(() => SUB_VIEW_ORDER.indexOf(subView), [subView]);

    const handleClose = () => {
        setView(view);
    };

    const handleTabChange = (_: unknown, value: number) => {
        setSubView(SUB_VIEW_ORDER[value]);
    };

    const handleDeleteClick = () => setIsDeleteDialogOpen(true);
    const handleDeleteCancel = () => setIsDeleteDialogOpen(false);
    const handleDeleteConfirm = () => {
        if (region && activeMapId) {
            setIsDeleteDialogOpen(false);
            handleClose();
            deleteRegion({ regionId: region.id, activeMapId });
        }
    };

    const isOpen = regionId !== null;

    let dialogContent: React.ReactNode = null;
    if (!region) {
        dialogContent = <NotFoundPage onClose={handleClose} />;
    } else {
        const { id, name } = region;

        dialogContent = (
            <>
                <RegionDetailsDialogTitle>
                    <div>
                        {id}. {name}
                    </div>
                    <Box flexGrow={1} />
                    {isEditModeEnabled && (
                        <IconButton onClick={handleDeleteClick}>
                            <Delete />
                        </IconButton>
                    )}
                </RegionDetailsDialogTitle>
                <RegionDetailsDialogContent>
                    <RegionDetailsDialogRegionPreview>
                        <RegionPreview doesRegionExist={true} regionId={id} mapId={activeMapId!} />
                    </RegionDetailsDialogRegionPreview>
                    <Box width="100%" display="flex" flexDirection="column">
                        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                            {SUB_VIEW_ORDER.map((subView) => (
                                <Tab key={subView} label={subView} />
                            ))}
                        </Tabs>
                    </Box>
                    {subView === SubView.Description && (
                        <RegionDescription isEditing={isEditModeEnabled} doesRegionExist={true} />
                    )}
                    {subView === SubView.Maps && <MapsPage />}
                    {subView === SubView.Notes && <NotesPage />}
                </RegionDetailsDialogContent>
            </>
        );
    }

    return (
        <>
            <Dialog open={isOpen} onClose={handleClose}>
                {dialogContent}
            </Dialog>
            <Dialog open={isDeleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Delete region</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {region?.id} ({region?.name})?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const RegionDetailsDialog = connectRegionDetailsDialog(RegionDetailsDialogBase);
