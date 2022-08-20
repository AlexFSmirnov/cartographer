import styled from 'styled-components';

export const RegionPreviewContainer = styled.div<{ shadow: string }>`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    & > canvas {
        box-shadow: ${(props) => props.shadow};
        border-radius: 8px;

        max-width: 100%;
        max-height: 100%;
    }
`;

export const RegionPreviewLoaderContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
`;
