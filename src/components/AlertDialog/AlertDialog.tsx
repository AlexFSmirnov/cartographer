import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { closeAlertDialog, getAlertDialogMessage } from '../../state';
import { StoreProps } from '../../types';

const connectAlertDialog = connect(
    createStructuredSelector({
        alertDialogMessage: getAlertDialogMessage,
    }),
    {
        closeAlertDialog,
    }
);

type AlertDialogProps = StoreProps<typeof connectAlertDialog>;

const AlertDialogBase: React.FC<AlertDialogProps> = ({ alertDialogMessage, closeAlertDialog }) => {
    const [message, setMessage] = useState<string | null>(alertDialogMessage);
    useEffect(() => {
        if (alertDialogMessage) {
            setMessage(alertDialogMessage);
        }
    }, [alertDialogMessage]);

    return (
        <Dialog open={alertDialogMessage !== null} onClose={closeAlertDialog}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeAlertDialog}>OK</Button>
            </DialogActions>
        </Dialog>
    );
};

export const AlertDialog = connectAlertDialog(AlertDialogBase);
