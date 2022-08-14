import { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Outlet } from 'react-router-dom';
import { CssBaseline, ThemeProvider, useTheme } from '@mui/material';
import { RouteName } from './enums';
import { useUrlNavigation } from './hooks';
import { darkTheme, lightTheme } from './themes';
import {
    getActiveMapId,
    getCurrentProjectMapIds,
    getCurrentProjectRootMapId,
    getIsDarkModeEnabled,
    setActiveMapId,
} from './state';
import {
    AlertDialog,
    BottomMenu,
    RegionDetailsDialog,
    Sidebar,
    Title,
    TopMenuButton,
    UploadMapDialog,
} from './components';
import { NotFound, EmptyProjectView } from './views';
import { AppContainer, AppContent, GlobalStyle, ViewContainer } from './style';

interface AppProps {
    stateActiveMapId: string | null;
    currentProjectMapIds: string[];
    currentProjectRootMapId: string | null;
    setActiveMapId: (regionId: string | null) => void;
}

const AppBase: React.FC<AppProps> = ({
    stateActiveMapId,
    currentProjectMapIds,
    currentProjectRootMapId,
    setActiveMapId,
}) => {
    const theme = useTheme();
    console.log(theme);

    const { getUrlParts, navigate } = useUrlNavigation();
    const { view, activeMap: urlActiveMapId } = getUrlParts();

    useEffect(() => {
        let redirectUrl = `/${RouteName.Map}`;

        if (view !== null && view !== RouteName.Map) {
            return;
        }

        if (view === null && urlActiveMapId === null && stateActiveMapId === null) {
            navigate(redirectUrl, { replace: true });
            return;
        }

        if (urlActiveMapId !== null) {
            if (
                urlActiveMapId !== stateActiveMapId &&
                currentProjectMapIds.includes(urlActiveMapId)
            ) {
                setActiveMapId(urlActiveMapId);
            }
        } else {
            if (stateActiveMapId !== null && currentProjectMapIds.includes(stateActiveMapId)) {
                navigate(`${redirectUrl}/${stateActiveMapId}`, { replace: true });
            } else {
                if (currentProjectRootMapId) {
                    setActiveMapId(currentProjectRootMapId);
                    navigate(`${redirectUrl}/${currentProjectRootMapId}`, { replace: true });
                }
            }
        }
    }, [
        view,
        urlActiveMapId,
        stateActiveMapId,
        currentProjectMapIds,
        currentProjectRootMapId,
        navigate,
        setActiveMapId,
    ]);

    const isNotFound = useMemo(
        () =>
            view === RouteName.Map &&
            urlActiveMapId !== null &&
            !currentProjectMapIds.includes(urlActiveMapId),
        [urlActiveMapId, currentProjectMapIds, view]
    );

    return (
        <AppContainer>
            <AppContent>
                <Title />
                <ViewContainer>
                    {currentProjectRootMapId === null && <EmptyProjectView />}
                    {currentProjectRootMapId !== null && isNotFound && <NotFound />}
                    {currentProjectRootMapId !== null && !isNotFound && <Outlet />}
                </ViewContainer>
                <BottomMenu />
            </AppContent>
            <TopMenuButton />
            <Sidebar />
            <UploadMapDialog />
            <RegionDetailsDialog />
            <AlertDialog />
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
        stateActiveMapId: getActiveMapId,
        currentProjectMapIds: getCurrentProjectMapIds,
        currentProjectRootMapId: getCurrentProjectRootMapId,
    }),
    {
        setActiveMapId,
    }
)(ThemedApp);
