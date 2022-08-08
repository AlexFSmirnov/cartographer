import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme } from '@mui/material';
import { Map, TextSnippet, FormatListBulleted } from '@mui/icons-material';
import { getActiveMapId } from '../../state';
import { RouteName } from '../../enums';
import { parseUrl } from '../../utils';
import { BottomMenuButton } from './BottomMenuButton';
import { BottomMenuContainer, DesktopBottomMenuPaper } from './style';

interface StateProps {
    activeMapId: string | null;
}

type BottomMenuProps = StateProps;

const BottomMenuBase: React.FC<BottomMenuProps> = ({ activeMapId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();
    const location = useLocation();
    const { view } = parseUrl(location.pathname);

    const handleNavigationActionClick = (viewIndex: number) => () => {
        switch (viewIndex) {
            case 1:
                navigate(`/${RouteName.Notes}`);
                break;
            case 2:
                navigate(`/${RouteName.Regions}`);
                break;
            case 0:
            default:
                if (activeMapId) {
                    navigate(`/${RouteName.Map}/${activeMapId}`);
                } else {
                    navigate(`/${RouteName.Map}`);
                }
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

export const BottomMenu = connect(
    createStructuredSelector({
        activeMapId: getActiveMapId,
    })
)(BottomMenuBase);
