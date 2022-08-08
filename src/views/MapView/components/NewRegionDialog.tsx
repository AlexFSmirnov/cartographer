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
import { closeNewRegionDialog, getNewRegionRect } from '../../../state';
import { Rect } from '../../../types';
import { RegionDescription, RegionPreviewCanvas } from '../../../components';
import { Info } from '@mui/icons-material';

interface OwnProps {
    activeMapImage: HTMLImageElement | null;
}

interface StateProps {
    newRegionRect: Rect | null;
}

interface DispatchProps {
    closeNewRegionDialog: typeof closeNewRegionDialog;
}

type NewRegionDialogProps = OwnProps & StateProps & DispatchProps;

const NewRegionDialogBase: React.FC<NewRegionDialogProps> = ({
    activeMapImage,
    newRegionRect,
    closeNewRegionDialog,
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

    const previewCanvasRef = useCallback(
        (previewCanvas: HTMLCanvasElement | null) => {
            const ctx = previewCanvas?.getContext('2d');
            if (!previewCanvas || !ctx || !previewRect || !activeMapImage) {
                return;
            }

            const { x, y } = previewRect;

            ctx.drawImage(activeMapImage, -x, -y, activeMapImage.width, activeMapImage.height);
        },
        [previewRect, activeMapImage]
    );

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
        console.log('CONFIRM');
    };

    const canvasSize = { width: previewRect?.width || 0, height: previewRect?.height || 0 };

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
    }),
    {
        closeNewRegionDialog,
    }
)(NewRegionDialogBase);