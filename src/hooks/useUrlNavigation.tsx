import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RouteName } from '../enums';
import { getActiveMapId } from '../state';
import { parseUrl } from '../utils';

export const useUrlNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeMapId = useSelector(getActiveMapId);

    const { view, activeMap, region, subView } = useMemo(
        () => parseUrl(location.pathname),
        [location.pathname]
    );

    const getUrlParts = () => ({ view, activeMap, region, subView });

    const setView = (view: RouteName | null) => {
        const finalView = view === null ? RouteName.Map : view;

        if (activeMapId && finalView === RouteName.Map) {
            navigate(`/${finalView}/${activeMapId}`);
        } else {
            navigate(`/${finalView}`);
        }
    };

    return {
        getUrlParts,
        setView,
        navigate,
        location,
    };
};
