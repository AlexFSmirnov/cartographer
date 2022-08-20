import Tabs, { TabsProps } from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';

const TAB_HEIGHT = 34;

export const SmallTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
    height: TAB_HEIGHT,
    minHeight: TAB_HEIGHT,
    backgroundColor: theme.palette.mode === 'dark' ? '#2e2e2e' : theme.palette.grey[100],
    borderRadius: 8,
    '& .MuiButtonBase-root': {
        height: TAB_HEIGHT,
        minHeight: TAB_HEIGHT,
        borderRadius: 8,
        zIndex: 1,
    },
    '& .MuiTabs-indicator': {
        height: TAB_HEIGHT,
        borderRadius: 8,
        zIndex: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
    },
}));
