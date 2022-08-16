import { Check, Close, Delete, Edit } from '@mui/icons-material';
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
import { useUrlNavigation } from '../../hooks';
import { deleteRegion, getCurrentProjectAllRegions, getIsEditModeEnabled } from '../../state';
import { Region } from '../../types';
import { RegionDescription } from '../RegionDescription';
import { RegionPreview } from '../RegionPreview';
import { NotFoundPage } from './pages';
import {
    RegionDetailsDialogContent,
    RegionDetailsDialogRegionPreview,
    RegionDetailsDialogTitle,
} from './style';

interface StateProps {
    isEditModeEnabled: boolean;
    regions: Region[];
}

interface DispatchProps {
    deleteRegion: typeof deleteRegion;
}

type RegionDetailsDialogProps = StateProps & DispatchProps;

const SUB_VIEW_ORDER = [SubView.Description, SubView.Maps, SubView.Notes, SubView.References];

const RegionDetailsDialogBase: React.FC<RegionDetailsDialogProps> = ({
    isEditModeEnabled,
    regions,
    deleteRegion,
}) => {
    const { setView, setSubView, getUrlParts } = useUrlNavigation();
    const { view, activeMap: activeMapId, region: regionId, subView } = getUrlParts();

    const [isEditingDescription, setIsEditingDescription] = useState(false);
    useEffect(() => setIsEditingDescription(isEditModeEnabled), [isEditModeEnabled]);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [region, setRegion] = useState<Region | null>(null);
    useEffect(() => {
        const region = regions.find((r) => r.id === regionId);
        if (regionId && region) {
            setRegion(region);
        }
    }, [regions, regionId, setRegion]);

    const tabValue = useMemo(() => SUB_VIEW_ORDER.indexOf(subView), [subView]);

    const handleClose = () => {
        setView(view);
        setIsEditingDescription(false);
    };

    const handleTabChange = (_: unknown, value: number) => {
        setSubView(SUB_VIEW_ORDER[value]);
    };

    const handleEditClick = () => setIsEditingDescription(true);
    const handleFinishEditingClick = () => setIsEditingDescription(false);

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
        const { id, name, description, notes, references, referencedBy } = region;

        dialogContent = (
            <>
                <RegionDetailsDialogTitle>
                    <div>
                        {id}. {name}
                    </div>
                    <Box flexGrow={1} />
                    {!isEditModeEnabled &&
                        subView === SubView.Description &&
                        (isEditingDescription ? (
                            <IconButton onClick={handleFinishEditingClick}>
                                <Check />
                            </IconButton>
                        ) : (
                            <IconButton onClick={handleEditClick}>
                                <Edit />
                            </IconButton>
                        ))}
                    <IconButton onClick={handleDeleteClick}>
                        <Delete />
                    </IconButton>
                </RegionDetailsDialogTitle>
                <RegionDetailsDialogContent>
                    <RegionDetailsDialogRegionPreview>
                        <RegionPreview doesRegionExist={true} regionId={id} mapId={activeMapId!} />
                    </RegionDetailsDialogRegionPreview>
                    <Box width="100%" height="100%" display="flex" flexDirection="column">
                        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                            {SUB_VIEW_ORDER.map((subView) => (
                                <Tab key={subView} label={subView} />
                            ))}
                        </Tabs>
                    </Box>
                    {subView === SubView.Description && (
                        <RegionDescription
                            isEditing={isEditingDescription}
                            doesRegionExist={true}
                            regionId={id}
                            activeMapId={activeMapId!}
                        />
                    )}
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

export const RegionDetailsDialog = connect(
    createStructuredSelector({
        isEditModeEnabled: getIsEditModeEnabled,
        regions: getCurrentProjectAllRegions,
    }),
    {
        deleteRegion,
    }
)(RegionDetailsDialogBase);
