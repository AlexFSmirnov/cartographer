import { useTheme } from '@mui/material';
import { DescriptionBlockquoteCircle, DescriptionBlockquoteContainer } from './style';

interface DescriptionBlockquoteProps {
    children: React.ReactNode;
}

export const DescriptionBlockquote: React.FC<DescriptionBlockquoteProps> = ({ children }) => {
    const theme = useTheme();

    const backgroundColor =
        theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700];
    const borderColor = theme.palette.primary.dark;

    return (
        <DescriptionBlockquoteContainer backgroundColor={backgroundColor} borderColor={borderColor}>
            {children}
            <DescriptionBlockquoteCircle color={borderColor} top left />
            <DescriptionBlockquoteCircle color={borderColor} left />
            <DescriptionBlockquoteCircle color={borderColor} top />
            <DescriptionBlockquoteCircle color={borderColor} />
        </DescriptionBlockquoteContainer>
    );
};
