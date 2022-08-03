import {
    BottomNavigation,
    BottomNavigationAction,
    useMediaQuery,
} from '@mui/material';
import { Map, TextSnippet, FormatListBulleted } from '@mui/icons-material';
import BottomMenuButton from './BottomMenuButton';
import { BottomMenuContainer, DesktopBottomMenuPaper } from './style';

const BottomMenu = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');

    const actions = [
        { label: 'Map', Icon: Map },
        { label: 'Notes', Icon: TextSnippet },
        { label: 'Regions', Icon: FormatListBulleted },
    ];

    if (isMobile) {
        return (
            <BottomMenuContainer>
                <BottomNavigation
                    sx={{ width: '100%', height: '64px', boxShadow: 3 }}
                    showLabels
                    value={0}
                >
                    {actions.map(({ label, Icon }) => (
                        <BottomNavigationAction label={label} icon={<Icon />} />
                    ))}
                </BottomNavigation>
            </BottomMenuContainer>
        );
    }

    return (
        <BottomMenuContainer>
            <DesktopBottomMenuPaper elevation={3}>
                {actions.map((props) => (
                    <BottomMenuButton {...props} onClick={() => {}} />
                ))}
            </DesktopBottomMenuPaper>
        </BottomMenuContainer>
    );
};

export default BottomMenu;
