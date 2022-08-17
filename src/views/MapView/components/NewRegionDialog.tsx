import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { Rect, StoreProps } from '../../../types';
import {
    addRegion,
    closeNewRegionDialog,
    getCurrentProjectAllRegions,
    getCurrentProjectMaps,
    getNewRegionRect,
    openAlertDialog,
} from '../../../state';
import { RegionDescription, RegionPreview } from '../../../components';

const connectNewRegionDialog = connect(
    createStructuredSelector({
        newRegionRect: getNewRegionRect,
        maps: getCurrentProjectMaps,
        allRegions: getCurrentProjectAllRegions,
    }),
    {
        closeNewRegionDialog,
        openAlertDialog,
        addRegion,
    }
);

interface NewRegionDialogProps extends StoreProps<typeof connectNewRegionDialog> {
    activeMapImage: HTMLImageElement | null;
}

const NewRegionDialogBase: React.FC<NewRegionDialogProps> = ({
    activeMapImage,
    newRegionRect,
    maps,
    allRegions,
    closeNewRegionDialog,
    openAlertDialog,
    addRegion,
}) => {
    const [isDescriptionEnabled, setIsDescriptionEnabled] = useState(false);
    const [description, setDescription] = useState('');

    const [regionId, setRegionId] = useState('');
    const [regionName, setRegionName] = useState('');

    const [previewRect, setPreviewRect] = useState<Rect | null>(null);
    useEffect(() => {
        if (newRegionRect) {
            setRegionId('');
            setRegionName('');
            setDescription('');
            setIsDescriptionEnabled(false);
            setPreviewRect(newRegionRect);
        }
    }, [newRegionRect]);

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRegionId(event.target.value);
    };
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRegionName(event.target.value);
    };
    const handleEnableDescription = () => {
        setIsDescriptionEnabled(true);
    };
    const handleDescriptionChange = (description: string) => {
        setDescription(description);
    };

    const handleConfirm = () => {
        if (!newRegionRect) {
            openAlertDialog('Please select a region on the map first.');
            return;
        }

        const existingRegion =
            maps[regionId] || allRegions.find((region) => region.id === regionId);

        if (existingRegion) {
            openAlertDialog(
                `Region with code "${regionId}" (${existingRegion.name}) already exists.`
            );
            return;
        }

        addRegion({
            id: regionId,
            name: regionName,
            description,
            notes: '',
            references: [],
            referencedBy: [],
            parentRect: newRegionRect,
        });

        closeNewRegionDialog();
    };

    return (
        <Dialog open={newRegionRect !== null} onClose={closeNewRegionDialog}>
            <DialogTitle>New region</DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '600px',
                    maxWidth: '100%',
                    maxHeight: '100%',
                }}
            >
                <Box
                    width="100%"
                    height="128px"
                    minHeight="128px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <RegionPreview
                        doesRegionExist={false}
                        mapImage={activeMapImage}
                        regionRect={previewRect}
                    />
                </Box>
                <Box pt={3} pb={2} width="100%" display="flex" justifyContent="space-between">
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: '23%' }}
                        label="Code"
                        value={regionId}
                        onChange={handleCodeChange}
                        required
                        autoFocus
                    />
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: '73%' }}
                        label="Title"
                        value={regionName}
                        onChange={handleTitleChange}
                    />
                </Box>
                {isDescriptionEnabled ? (
                    <RegionDescription
                        isEditing
                        doesRegionExist={false}
                        description={description}
                        onChange={handleDescriptionChange}
                    />
                ) : (
                    <Button onClick={handleEnableDescription} variant="outlined" fullWidth>
                        Add description
                    </Button>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeNewRegionDialog}>Cancel</Button>
                <Button disabled={!regionId} onClick={handleConfirm} variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const NewRegionDialog = connectNewRegionDialog(NewRegionDialogBase);
