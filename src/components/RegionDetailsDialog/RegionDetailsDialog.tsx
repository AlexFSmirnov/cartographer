import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle } from '@mui/material';
import { parseUrl } from '../../utils';

export const RegionDetailsDialog = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { view, activeMap, region, subView } = parseUrl(location.pathname);

    const isOpen = region !== null;

    const handleClose = () => {
        if (activeMap) {
            navigate(`/${view}/${activeMap}`);
        } else {
            navigate(`/${view}`);
        }
    };

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>RegionDetails, {subView}</DialogTitle>
        </Dialog>
    );
};
