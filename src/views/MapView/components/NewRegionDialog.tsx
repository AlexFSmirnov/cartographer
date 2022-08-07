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
} from '@mui/material';
import { closeNewRegionDialog, getNewRegionRect } from '../../../state';
import { Rect } from '../../../types';

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
    const [previewRect, setPreviewRect] = useState<Rect | null>(null);
    useEffect(() => {
        if (newRegionRect) {
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

    const canvasSize = { width: previewRect?.width || 0, height: previewRect?.height || 0 };

    return (
        <Dialog open={newRegionRect !== null} onClose={closeNewRegionDialog}>
            <DialogTitle>New region</DialogTitle>
            <DialogContent>
                <Box width="512px" maxWidth="90%">
                    <canvas {...canvasSize} ref={previewCanvasRef} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeNewRegionDialog}>Cancel</Button>
                <Button onClick={() => {}} variant="contained">
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
