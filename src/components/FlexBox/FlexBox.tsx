import { forwardRef, Ref } from 'react';
import { Box, BoxProps } from '@mui/material';

interface FlexBoxProps extends BoxProps {
    direction?: BoxProps['flexDirection'];
    row?: boolean;
    column?: boolean;

    center?: boolean;
    alignX?: BoxProps['justifyContent'];
    alignY?: BoxProps['justifyContent'];

    fullWidth?: boolean;
    fullHeight?: boolean;

    forwardedRef?: Ref<HTMLDivElement>;
}

const FlexBoxBase: React.FC<FlexBoxProps> = ({
    direction = 'row',
    row,
    column,
    center,
    alignX,
    alignY,
    fullWidth,
    fullHeight,
    children,
    forwardedRef,
    ...props
}) => {
    let finalDirection = direction;
    if (row) {
        finalDirection = 'row';
    }
    if (column) {
        finalDirection = 'column';
    }

    let justifyContent = finalDirection === 'row' ? alignX : alignY;
    let alignItems = finalDirection === 'row' ? alignY : alignX;

    if (center) {
        justifyContent = 'center';
        alignItems = 'center';
    }

    const width = fullWidth ? '100%' : props.width;
    const height = fullHeight ? '100%' : props.height;

    return (
        <Box
            {...props}
            display="flex"
            flexDirection={finalDirection}
            justifyContent={justifyContent}
            alignItems={alignItems}
            width={width}
            height={height}
            ref={forwardedRef}
        >
            {children}
        </Box>
    );
};

export const FlexBox = forwardRef<HTMLDivElement, FlexBoxProps>((props, ref) => (
    <FlexBoxBase {...props} forwardedRef={ref} />
));
