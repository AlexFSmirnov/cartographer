import { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { CssBaseline, ThemeProvider } from '@mui/material';
import {
    AlertDialog,
    BottomMenu,
    FullscreenLoader,
    RegionDetailsDialog,
    Sidebar,
    Title,
    TopMenuButton,
    UploadMapDialog,
} from './components';
import {
    getActiveMapId,
    getCurrentProjectId,
    getCurrentProjectMapIds,
    getCurrentProjectRootMapId,
    getIsDarkModeEnabled,
    setActiveMapId,
} from './state';
import { AppContainer, AppContent, GlobalStyle, ViewContainer } from './style';
import { darkTheme, lightTheme } from './themes';
import { StoreProps, RouteName } from './types';
import { useImagesContext, useUrlNavigation } from './utils';
import { NotFound, EmptyProjectView } from './views';

const connectApp = connect(
    createStructuredSelector({
        isDarkModeEnabled: getIsDarkModeEnabled,
        stateActiveMapId: getActiveMapId,
        currentProjectMapIds: getCurrentProjectMapIds,
        currentProjectRootMapId: getCurrentProjectRootMapId,
        currentProjectId: getCurrentProjectId,
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
    currentProjectId,
    setActiveMapId,
}) => {
    const { getUrlParts, navigate, location } = useUrlNavigation();
    const { view, activeMapId: urlActiveMapId } = getUrlParts();

    const { setProjectId } = useImagesContext();

    useEffect(() => {
        let redirectUrl = `/${RouteName.Map}`;

        if (location.hash) {
            navigate(location.hash.slice(1), { replace: true });
            return;
        }

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

    useEffect(() => {
        setProjectId(currentProjectId);
    }, [currentProjectId, setProjectId]);

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
            <FullscreenLoader />
        </AppContainer>
    );
};

const ThemedApp: React.FC<AppProps> = (props) => {
    const { isDarkModeEnabled } = props;

    const theme = useMemo(() => (isDarkModeEnabled ? darkTheme : lightTheme), [isDarkModeEnabled]);

    useEffect(() => {
        const favicon = document.getElementById('favicon') as HTMLLinkElement;
        if (isDarkModeEnabled) {
            favicon.href = `${process.env.PUBLIC_URL}/favicon-white.svg`;
        } else {
            favicon.href = `${process.env.PUBLIC_URL}/favicon-black.svg`;
        }
    }, [isDarkModeEnabled]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyle colorScheme={isDarkModeEnabled ? 'dark' : 'light'} />
            <AppBase {...props} />
        </ThemeProvider>
    );
};

export const App = connectApp(ThemedApp);
