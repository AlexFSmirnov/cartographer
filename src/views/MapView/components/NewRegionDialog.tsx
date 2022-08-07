import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Dialog } from '@mui/material';
import { closeNewRegionDialog, getNewRegionRect } from '../../../state';
import { Rect } from '../../../types';

interface StateProps {
    newRegionRect: Rect | null;
}

interface DispatchProps {
    closeNewRegionDialog: typeof closeNewRegionDialog;
}

type NewRegionDialogProps = StateProps & DispatchProps;

const NewRegionDialogBase: React.FC<NewRegionDialogProps> = ({
    newRegionRect,
    closeNewRegionDialog,
}) => {
    return (
        <Dialog open={newRegionRect !== null} onClose={closeNewRegionDialog}>
            {JSON.stringify(newRegionRect)}
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
