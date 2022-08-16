import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    TextField,
    Tooltip,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { StoreProps } from '../../types';
import { useUrlNavigation } from '../../hooks';
import { getCurrentProjectMaps, getCurrentProjectRegionsByMap } from '../../state';
import { UploadChildMapDialogDropzoneContainer } from './style';
import { DropzoneWithPreview } from '../DropzoneWithPreview';

const connectUploadChildMapDialog = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
        regionsByMap: getCurrentProjectRegionsByMap,
    })
);

interface UploadChildMapDialogProps extends StoreProps<typeof connectUploadChildMapDialog> {
    isOpen: boolean;
    onClose: () => void;
}

const UploadChildMapDialogBase: React.FC<UploadChildMapDialogProps> = ({
    isOpen,
    onClose,
    regionsByMap,
}) => {
    const { getUrlParts } = useUrlNavigation();
    const { region: regionId, activeMap: activeMapId } = getUrlParts();

    const [mapId, setMapId] = useState('');
    const [mapTitle, setMapTitle] = useState('');
    const [mapFloor, setMapFloor] = useState('');

    useEffect(() => {
        if (!mapId && regionId) {
            setMapId(regionId);
        }
    }, [mapId, regionId]);

    useEffect(() => {
        if (!mapTitle && activeMapId && regionId) {
            const { name } = regionsByMap[activeMapId][regionId];
            setMapTitle(name || regionId);
        }
    }, [mapTitle, activeMapId, regionId, regionsByMap]);

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMapId(e.target.value);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMapTitle(e.target.value);
    };

    const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMapFloor(e.target.value);
    };

    const handleFileDrop = (file: File) => {};

    const handleCancelClick = () => {};
    const handleConfirmClick = () => {};

    const isConfirmDisabled = false;

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Upload child map</DialogTitle>
            <DialogContent sx={{ width: '550px', maxWidth: '100%' }}>
                <DialogContentText>
                    Child maps should be used for regions that have their own maps provided. For
                    example, a region representing a house on a city map can have a child map for
                    its floor plan.
                </DialogContentText>
                <Box pt={1} pb={2} width="100%" display="flex" justifyContent="space-between">
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: '22%' }}
                        label="Code"
                        value={mapId}
                        onChange={handleCodeChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="A short identifier of the map, usually the same as the code of its parent region.">
                                        <Info fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: '52%' }}
                        label="Title"
                        value={mapTitle}
                        onChange={handleTitleChange}
                        required
                        autoFocus
                    />
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: '22%' }}
                        label="Floor"
                        value={mapFloor}
                        onChange={handleFloorChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="One region can have multiple maps, usually distinguished by their floor number.">
                                        <Info fontSize="small" />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <UploadChildMapDialogDropzoneContainer>
                    <DropzoneWithPreview onDrop={handleFileDrop} />
                </UploadChildMapDialogDropzoneContainer>
            </DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={handleCancelClick}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    disabled={isConfirmDisabled}
                    onClick={handleConfirmClick}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const UploadChildMapDialog = connectUploadChildMapDialog(UploadChildMapDialogBase);
