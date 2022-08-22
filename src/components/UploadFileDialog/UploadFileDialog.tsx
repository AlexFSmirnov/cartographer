import { useState } from 'react';
import { connect } from 'react-redux';
import { Close } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Typography,
} from '@mui/material';
import { openAlertDialog } from '../../state';
import { StoreProps } from '../../types';
import { Dropzone } from '../Dropzone';
import { FlexBox } from '../FlexBox';

const connectUploadFileDialog = connect(null, {
    openAlertDialog,
});

interface UploadFileDialogProps extends StoreProps<typeof connectUploadFileDialog> {
    open: boolean;
    title: string;
    content: React.ReactNode;
    acceptFiletype?: string;
    dropzoneHeight?: number;
    onClose: () => void;
    onUpload: (file: File) => void;
}

const UploadFileDialogBase = ({
    open,
    title,
    content,
    acceptFiletype,
    dropzoneHeight = 256,
    onClose,
    onUpload,
    openAlertDialog,
}: UploadFileDialogProps) => {
    const [importedFile, setImportedFile] = useState<File | null>(null);

    const handleFileDrop = (files: File[]) => {
        if (files.length !== 1) {
            openAlertDialog('Please select a single file');
            return;
        }
        setImportedFile(files[0]);
    };

    const handleConfirm = () => {
        if (!importedFile) {
            openAlertDialog('Please select a file');
            return;
        }

        onUpload(importedFile);
        handleClose();
    };

    const handleClose = () => {
        setImportedFile(null);
        onClose();
    };

    const handleFileCancel = () => setImportedFile(null);

    const accept = acceptFiletype ? { 'text/*': [`.${acceptFiletype}`] } : undefined;

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent sx={{ width: '575px', maxWidth: '100%' }}>
                {content}
                <Box pt={2} />
                <FlexBox fullWidth height={dropzoneHeight} center>
                    {importedFile === null ? (
                        <Dropzone accept={accept} onDrop={handleFileDrop} />
                    ) : (
                        <Paper elevation={2} sx={{ width: '100%' }}>
                            <FlexBox
                                fullWidth
                                height="64px"
                                p={2}
                                alignX="space-between"
                                alignY="center"
                            >
                                <Typography>{importedFile.name}</Typography>
                                <IconButton onClick={handleFileCancel}>
                                    <Close />
                                </IconButton>
                            </FlexBox>
                        </Paper>
                    )}
                </FlexBox>
            </DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    disabled={importedFile === null}
                    onClick={handleConfirm}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const UploadFileDialog = connectUploadFileDialog(UploadFileDialogBase);
