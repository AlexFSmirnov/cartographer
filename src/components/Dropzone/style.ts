import styled from 'styled-components';

interface DropzoneContainerProps {
    borderColor: string;
}

export const DropzoneContainer = styled.div<DropzoneContainerProps>`
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border: 1px dashed ${(props) => props.borderColor};
    border-radius: 5px;

    cursor: pointer;
`;
