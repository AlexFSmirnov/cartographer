import styled from 'styled-components';
import { Box, DialogContent, DialogTitle } from '@mui/material';

export const RegionDetailsDialogTitle = styled(DialogTitle)`
    display: flex;
    align-items: center;
    padding-bottom: 0;
`;

export const RegionDetailsDialogContent = styled(DialogContent)`
    display: flex;
    flex-direction: column;
    width: 600px;
    max-width: 100%;
    height: 630px;
    max-height: 100%;
`;

export const RegionDetailsDialogRegionPreview = styled(Box)`
    width: 100%;
    height: 128px;
    min-height: 128px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding-bottom: 8px;
`;
