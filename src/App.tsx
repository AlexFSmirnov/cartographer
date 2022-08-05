import { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, useTheme } from '@mui/material';
import { parseUrl, RouteName } from './routing';
import { darkTheme, lightTheme } from './themes';
import {
    getActiveMapRegionId,
    getCurrentProjectRegionIds,
    getIsDarkModeEnabled,
    setActiveMapRegionId,
} from './state';
import { BottomMenu, Sidebar, TopMenuButton, UploadMapDialog } from './components';
import { MapView, NotesView } from './views';
import { AppContainer, GlobalStyle, ViewContainer } from './style';

interface AppProps {
    activeMapRegionId: string | null;
    currentProjectRegionIds: string[];
    setActiveMapRegionId: (regionId: string) => void;
}

const AppBase: React.FC<AppProps> = ({
    activeMapRegionId,
    currentProjectRegionIds,
    setActiveMapRegionId,
}) => {
    const theme = useTheme();

    const navigate = useNavigate();
    const location = useLocation();
    const { view, activeMap, region, subView } = parseUrl(location.pathname);

    useEffect(() => {
        let redirectUrl = `/${RouteName.Map}`;

        if (view !== null && view !== RouteName.Map) {
            return;
        }

        if (!activeMap && !activeMapRegionId) {
            navigate(redirectUrl, { replace: true });
            return;
        }

        // TODO: Should use the root region instead
        if (!activeMap && activeMapRegionId) {
            redirectUrl = `${redirectUrl}/${activeMapRegionId}`;
            navigate(redirectUrl, { replace: true });
            return;
        }

        if (activeMap !== null && activeMap !== activeMapRegionId) {
            setActiveMapRegionId(activeMap);
        }
    }, [view, activeMap, activeMapRegionId, navigate, setActiveMapRegionId]);

    return (
        <AppContainer>
            <ViewContainer>
                <Outlet />
            </ViewContainer>
            <TopMenuButton />
            <Sidebar />
            <BottomMenu />
            <UploadMapDialog />
        </AppContainer>
    );
};

interface ThemedAppProps {
    isDarkModeEnabled: boolean;
    activeMapRegionId: string | null;
    currentProjectRegionIds: string[];
    setActiveMapRegionId: (regionId: string) => void;
}

const ThemedApp: React.FC<ThemedAppProps> = ({ isDarkModeEnabled, ...rest }) => {
    const theme = useMemo(() => (isDarkModeEnabled ? darkTheme : lightTheme), [isDarkModeEnabled]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyle />
            <AppBase {...rest} />
        </ThemeProvider>
    );
};

export const App = connect(
    createStructuredSelector({
        isDarkModeEnabled: getIsDarkModeEnabled,
        activeMapRegionId: getActiveMapRegionId,
        currentProjectRegionIds: getCurrentProjectRegionIds,
    }),
    {
        setActiveMapRegionId,
    }
)(ThemedApp);
