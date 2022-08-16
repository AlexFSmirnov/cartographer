import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RouteName, SubView } from '../enums';
import { getActiveMapId } from '../state';
import { parseUrl } from '../utils';

export const useUrlNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeMapId = useSelector(getActiveMapId);

    // TODO: Change to view, activeMapId, regionId and subView
    const { view, activeMap, region, subView } = useMemo(
        () => parseUrl(location.pathname),
        [location.pathname]
    );

    const getUrlParts = () => ({ view, activeMap, region, subView });

    const setView = (newView: RouteName | null) => {
        const finalView = newView === null ? RouteName.Map : newView;

        if (activeMapId) {
            navigate(`/${finalView}/${activeMapId}`);
        } else {
            navigate(`/${finalView}`);
        }
    };

    const setMap = (newMapId: string | null) => {
        if (newMapId) {
            navigate(`/${view}/${newMapId}`);
        }
    };

    const setRegion = (newRegion: string | null) => {
        if (!newRegion) {
            return;
        }

        navigate(`/${view}/${activeMap}/${newRegion}/${subView || SubView.Description}`);
    };

    const setSubView = (newSubView?: SubView | null) => {
        navigate(`/${view}/${activeMap}/${region}/${newSubView || SubView.Description}`);
    };

    return {
        getUrlParts,
        setView,
        setMap,
        setRegion,
        setSubView,
        navigate,
        location,
    };
};
