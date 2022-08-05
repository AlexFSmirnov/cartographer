import { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, useTheme } from '@mui/material';
import { parseUrl, RouteName } from './routing';
import { darkTheme, lightTheme } from './themes';
import {
    getActiveMapRegionId,
    getCurrentProjectFirstRootRegionId,
    getCurrentProjectRegionIds,
    getIsDarkModeEnabled,
    setActiveMapRegionId,
} from './state';
import { BottomMenu, Sidebar, Title, TopMenuButton, UploadMapDialog } from './components';
import { MapView, NotesView, NotFound } from './views';
import { AppContainer, AppContent, GlobalStyle, ViewContainer } from './style';
import { EmptyProjectView } from './views/EmptyProjectView';

interface AppProps {
    activeMapRegionId: string | null;
    currentProjectRegionIds: string[];
    currentProjectRootRegionId: string | null;
    setActiveMapRegionId: (regionId: string | null) => void;
}

const AppBase: React.FC<AppProps> = ({
    activeMapRegionId,
    currentProjectRegionIds,
    currentProjectRootRegionId,
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

        if (view === null && activeMap === null && activeMapRegionId === null) {
            navigate(redirectUrl, { replace: true });
            return;
        }

        if (activeMap !== null) {
            if (activeMap !== activeMapRegionId && currentProjectRegionIds.includes(activeMap)) {
                setActiveMapRegionId(activeMap);
            }
        } else {
            if (activeMapRegionId !== null && currentProjectRegionIds.includes(activeMapRegionId)) {
                navigate(`${redirectUrl}/${activeMapRegionId}`);
            } else {
                if (currentProjectRootRegionId) {
                    setActiveMapRegionId(currentProjectRootRegionId);
                    navigate(`${redirectUrl}/${currentProjectRootRegionId}`);
                }
            }
        }
    }, [
        view,
        activeMap,
        activeMapRegionId,
        currentProjectRegionIds,
        currentProjectRootRegionId,
        navigate,
        setActiveMapRegionId,
    ]);

    const isNotFound = useMemo(
        () =>
            view === RouteName.Map &&
            activeMap !== null &&
            !currentProjectRegionIds.includes(activeMap),
        [activeMap, currentProjectRegionIds, view]
    );

    return (
        <AppContainer>
            <AppContent>
                <Title />
                <ViewContainer>
                    {currentProjectRootRegionId === null && <EmptyProjectView />}
                    {currentProjectRootRegionId !== null && isNotFound && <NotFound />}
                    {currentProjectRootRegionId !== null && !isNotFound && <Outlet />}
                </ViewContainer>
                <BottomMenu />
            </AppContent>
            <TopMenuButton />
            <Sidebar />
            <UploadMapDialog />
        </AppContainer>
    );
};

interface ThemedAppProps extends AppProps {
    isDarkModeEnabled: boolean;
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
        currentProjectRootRegionId: getCurrentProjectFirstRootRegionId,
    }),
    {
        setActiveMapRegionId,
    }
)(ThemedApp);
