import styled from 'styled-components';

export const ProjectSelectContainer = styled.div<{ backgroundColor: string; color: string }>`
    width: 320px;
    height: 64px;

    padding: 0 8px;
    background-color: ${(props) => props.backgroundColor};
    color: ${(props) => props.color};

    display: flex;
    justify-content: space-between;
    align-items: center;

    cursor: pointer;
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
