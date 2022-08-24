import styled from 'styled-components';

interface DescriptionBlockquoteContainerProps {
    backgroundColor: string;
    borderColor: string;
}

export const DescriptionBlockquoteContainer = styled.div<DescriptionBlockquoteContainerProps>`
    position: relative;
    background-color: ${(props) => props.backgroundColor};
    padding: 12px;
    margin: 12px 0;
    margin-bottom: 28px;

    border-left: 2px solid ${(props) => props.borderColor};
    border-right: 2px solid ${(props) => props.borderColor};

    & > div {
        padding-bottom: 0;
    }
`;

interface DescriptionBlockquoteCircleProps {
    top?: boolean;
    left?: boolean;
    color: string;
}

export const DescriptionBlockquoteCircle = styled.div<DescriptionBlockquoteCircleProps>`
    position: absolute;
    ${(props) => (props.top ? 'top: -4px;' : 'bottom: -4px;')}
    ${(props) => (props.left ? 'left: -5px;' : 'right: -5.5px;')}

    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) => props.color};
`;
