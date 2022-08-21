import styled from 'styled-components';
import { Paper } from '@mui/material';

export const BottomMenuContainer = styled.div`
    height: 64px;
    min-height: 64px;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
`;

export const DesktopBottomMenuPaper = styled(Paper)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 4px;
    height: 48px;
    border-radius: 24px;

    width: 150px;
    max-width: 90%;
`;
