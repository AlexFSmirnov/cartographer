import { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { CssBaseline, ThemeProvider, useTheme } from '@mui/material';
import {
    AlertDialog,
    BottomMenu,
    RegionDetailsDialog,
    Sidebar,
    Title,
    TopMenuButton,
    UploadMapDialog,
} from './components';
import {
    getActiveMapId,
    getCurrentProjectMapIds,
    getCurrentProjectRootMapId,
    getIsDarkModeEnabled,
    setActiveMapId,
} from './state';
import { AppContainer, AppContent, GlobalStyle, ViewContainer } from './style';
import { darkTheme, lightTheme } from './themes';
import { StoreProps, RouteName } from './types';
import { useUrlNavigation } from './utils';
import { NotFound, EmptyProjectView } from './views';

const connectApp = connect(
    createStructuredSelector({
        isDarkModeEnabled: getIsDarkModeEnabled,
        stateActiveMapId: getActiveMapId,
        currentProjectMapIds: getCurrentProjectMapIds,
        currentProjectRootMapId: getCurrentProjectRootMapId,
    }),
    {
        setActiveMapId,
    }
);

type AppProps = StoreProps<typeof connectApp>;

const AppBase: React.FC<AppProps> = ({
    stateActiveMapId,
    currentProjectMapIds,
    currentProjectRootMapId,
    setActiveMapId,
}) => {
    const theme = useTheme();
    console.log(theme);

    const { getUrlParts, navigate } = useUrlNavigation();
    const { view, activeMapId: urlActiveMapId } = getUrlParts();

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
            <RegionDetailsDialog />
            <UploadMapDialog />
            <AlertDialog />
        </AppContainer>
    );
};

const ThemedApp: React.FC<AppProps> = (props) => {
    const { isDarkModeEnabled } = props;

    const theme = useMemo(() => (isDarkModeEnabled ? darkTheme : lightTheme), [isDarkModeEnabled]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyle colorScheme={isDarkModeEnabled ? 'dark' : 'light'} />
            <AppBase {...props} />
        </ThemeProvider>
    );
};

export const App = connectApp(ThemedApp);
