import styled from 'styled-components';

export const DropzonePreview = styled.img<{ shadow: string }>`
    max-width: 100%;
    max-height: 100%;

    border-radius: 5px;
    box-shadow: ${(props) => props.shadow};
`;
