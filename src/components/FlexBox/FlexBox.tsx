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
}

export const FlexBox: React.FC<FlexBoxProps> = ({
    direction = 'row',
    row,
    column,
    center,
    alignX,
    alignY,
    fullWidth,
    fullHeight,
    children,
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
        >
            {children}
        </Box>
    );
};
