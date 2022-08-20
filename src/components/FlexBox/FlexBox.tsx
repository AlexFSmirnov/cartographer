import { Box, BoxProps } from '@mui/material';

interface FlexBoxProps extends BoxProps {
    direction?: BoxProps['flexDirection'];
    row?: boolean;
    column?: boolean;

    center?: boolean;
    alignX?: BoxProps['justifyContent'];
    alignY?: BoxProps['justifyContent'];
}

export const FlexBox: React.FC<FlexBoxProps> = ({
    direction = 'row',
    row,
    column,
    center,
    alignX = 'flex-start',
    alignY = 'flex-start',
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

    return (
        <Box
            {...props}
            display="flex"
            flexDirection={finalDirection}
            justifyContent={justifyContent}
            alignItems={alignItems}
        >
            {children}
        </Box>
    );
};
