import { Dialog, DialogTitle } from '@mui/material';
import { useUrlNavigation } from '../../hooks';

export const RegionDetailsDialog = () => {
    const { setView, getUrlParts } = useUrlNavigation();
    const { view, activeMap, region, subView } = getUrlParts();

    const isOpen = region !== null;

    const handleClose = () => {
        setView(view);
    };

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>RegionDetails, {subView}</DialogTitle>
        </Dialog>
    );
};
