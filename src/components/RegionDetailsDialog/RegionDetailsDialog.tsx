import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle } from '@mui/material';
import { parseUrl } from '../../utils';

export const RegionDetailsDialog = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { view, activeMap, region, subView } = parseUrl(location.pathname);

    const isOpen = region !== null;

    return (
        <Dialog open={isOpen}>
            <DialogTitle>RegionDetails</DialogTitle>
        </Dialog>
    );
};
