import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {
    addRegion,
    closeNewRegionDialog,
    getActiveMapRegionId,
    getCurrentProjectRegionIds,
    getCurrentProjectRegions,
    getNewRegionRect,
    openAlertDialog,
} from '../../../state';
import { Rect, Region } from '../../../types';
import { RegionDescription, RegionPreviewCanvas } from '../../../components';
import { Info } from '@mui/icons-material';

interface OwnProps {
    activeMapImage: HTMLImageElement | null;
}

interface StateProps {
    newRegionRect: Rect | null;
    currentProjectRegions: Record<string, Region>;
    activeMapRegionId: string | null;
}

interface DispatchProps {
    closeNewRegionDialog: typeof closeNewRegionDialog;
    openAlertDialog: typeof openAlertDialog;
    addRegion: typeof addRegion;
}

type NewRegionDialogProps = OwnProps & StateProps & DispatchProps;

const TEST_DESCRIPTION = `
This is a test description.

# Header 1
This is a header 1.

## Header 2
This is a header 2.

### Header 3
This is a header 3.

### Header 4
This is a header 4.

### Header 5
This is a header 5.

### Header 6
This is a header 6.

- List item 1
- List item 2
- List item 3

1. List item 2
2. List item 2
3. List item 2

> This is a quote
is it multiline?

> This is another quote
> is it multiline?

This is a link to [K95].

With single: *bold* _italic_ ~strikethrough~
With double: **bold** __italic__ ~~strikethrough~~
`;

const NewRegionDialogBase: React.FC<NewRegionDialogProps> = ({
    activeMapImage,
    newRegionRect,
    currentProjectRegions,
    activeMapRegionId,
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
        const existingRegion = currentProjectRegions[regionId];
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
            floorNumber: null,
            references: [],
            referencedBy: [],
            root: false,
            parent: activeMapRegionId,
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
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <RegionPreviewCanvas parentMapImage={activeMapImage} regionRect={previewRect} />
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

export const NewRegionDialog = connect(
    createStructuredSelector({
        newRegionRect: getNewRegionRect,
        currentProjectRegions: getCurrentProjectRegions,
        activeMapRegionId: getActiveMapRegionId,
    }),
    {
        closeNewRegionDialog,
        openAlertDialog,
        addRegion,
    }
)(NewRegionDialogBase);
