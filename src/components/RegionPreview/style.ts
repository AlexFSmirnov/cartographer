import styled from 'styled-components';

export const RegionPreviewContainer = styled.div<{ shadow: string }>`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    & > * {
        box-shadow: ${(props) => props.shadow};
        border-radius: 8px;
    }
`;
