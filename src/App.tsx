import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { createTheme, useTheme } from '@mui/material';
import { parseUrl, RouteName } from './routing';
import { BottomMenu, Sidebar, TopMenuButton } from './components';
import { MapView, NotesView } from './views';
import { AppContainer, ViewContainer } from './style';

export const App = () => {
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
