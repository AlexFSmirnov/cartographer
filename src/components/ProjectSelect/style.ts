import styled from 'styled-components';
import { Button } from '@mui/material';

export const ProjectSelectContainer = styled(Button)`
    width: 320px;
    height: 64px;

    border-radius: 0;
    text-transform: none;

    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const ProjectSelectIconWrapper = styled.div<{ isOpen: boolean }>`
    width: 24px;
    height: 24px;

    ${(props) => (props.isOpen ? 'transform: rotate(-180deg);' : '')}
    transition: transform 0.2s ease-in-out;
`;

export const ProjectSelectItemsContainer = styled.div`
    width: 320px;
`;
