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
