import styled from 'styled-components';
import { Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

export const ProjectSelectContainer = styled(Button)`
    width: 320px;
    height: 64px;

    border-radius: 0;
    text-transform: none;

    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const ProjectSelectIcon = styled(ExpandMore)<{ isOpen: boolean }>`
    ${(props) => (props.isOpen ? 'transform: rotate(-180deg);' : '')}
    transition: transform 0.2s ease-in-out;
`;

export const ProjectSelectItemsContainer = styled.div`
    width: 320px;
`;

export const ProjectSelectItemWrapper = styled(Button)`
    width: 100%;
    height: 48px;

    display: flex;
    align-items: center;

    border-radius: 0;
    text-transform: none;
`;
