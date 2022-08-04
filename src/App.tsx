import { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, useTheme } from '@mui/material';
import { parseUrl, RouteName } from './routing';
import { darkTheme, lightTheme } from './themes';
import { getIsDarkModeEnabled } from './state';
import { BottomMenu, Sidebar, TopMenuButton } from './components';
import { MapView, NotesView } from './views';
import { AppContainer, GlobalStyle, ViewContainer } from './style';

const AppBase = () => {
    const theme = useTheme();

    const navigate = useNavigate();
    const location = useLocation();
    const { view, region, subView } = parseUrl(location.pathname);

    useEffect(() => {
        if (!view) {
            navigate(`/${RouteName.Map}`, { replace: true });
        }
    }, [view, navigate]);

    return (
        <AppContainer>
            <ViewContainer>
                <Outlet />
            </ViewContainer>
            <TopMenuButton />
            <Sidebar />
            <BottomMenu />
        </AppContainer>
    );
};

interface ThemedAppProps {
    isDarkModeEnabled: boolean;
}

const ThemedApp: React.FC<ThemedAppProps> = ({ isDarkModeEnabled }) => {
    const theme = useMemo(() => (isDarkModeEnabled ? darkTheme : lightTheme), [isDarkModeEnabled]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyle />
            <AppBase />
        </ThemeProvider>
    );
};

export const App = connect(
    createStructuredSelector({
        isDarkModeEnabled: getIsDarkModeEnabled,
    })
)(ThemedApp);
