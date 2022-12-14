import { Map, TextSnippet, FormatListBulleted } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from '@mui/material';
import { RouteName } from '../../types';
import { useUrlNavigation } from '../../utils';
import { BottomMenuButton } from './BottomMenuButton';
import { BottomMenuContainer, DesktopBottomMenuPaper } from './style';

export const BottomMenu = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { getUrlParts, setUrlParts } = useUrlNavigation();
    const { view } = getUrlParts();

    const handleNavigationActionClick = (viewIndex: number) => () => {
        switch (viewIndex) {
            case 1:
                setUrlParts({ view: RouteName.Notes });
                break;
            case 2:
                setUrlParts({ view: RouteName.Regions });
                break;
            case 0:
            default:
                setUrlParts({ view: RouteName.Map });
                break;
        }
    };

    const actions = [
        { label: 'Map', Icon: Map },
        { label: 'Notes', Icon: TextSnippet },
        { label: 'Regions', Icon: FormatListBulleted },
    ];

    const activeViewIndex = view
        ? [RouteName.Map, RouteName.Notes, RouteName.Regions].indexOf(view)
        : -1;

    if (isMobile) {
        return (
            <BottomMenuContainer>
                <BottomNavigation
                    sx={{ width: '100%', height: '64px', boxShadow: 3 }}
                    showLabels
                    value={activeViewIndex}
                >
                    {actions.map(({ label, Icon }, index) => (
                        <BottomNavigationAction
                            key={label}
                            label={label}
                            icon={<Icon />}
                            onClick={handleNavigationActionClick(index)}
                        />
                    ))}
                </BottomNavigation>
            </BottomMenuContainer>
        );
    }

    return (
        <BottomMenuContainer>
            <DesktopBottomMenuPaper elevation={3}>
                {actions.map(({ label, Icon }, index) => (
                    <BottomMenuButton
                        key={label}
                        label={label}
                        Icon={Icon}
                        active={index === activeViewIndex}
                        onClick={handleNavigationActionClick(index)}
                    />
                ))}
            </DesktopBottomMenuPaper>
        </BottomMenuContainer>
    );
};
