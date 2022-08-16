import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RouteName, SubView } from '../enums';
import { getActiveMapId } from '../state';
import { parseUrl } from '../utils';

export const useUrlNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const stateActiveMapId = useSelector(getActiveMapId);

    const { view, activeMapId, regionId, subView } = useMemo(
        () => parseUrl(location.pathname),
        [location.pathname]
    );

    const getUrlParts = () => ({ view, activeMapId, regionId, subView });

    const setView = (newView: RouteName | null) => {
        const finalView = newView === null ? RouteName.Map : newView;

        if (stateActiveMapId) {
            navigate(`/${finalView}/${stateActiveMapId}`);
        } else {
            navigate(`/${finalView}`);
        }
    };

    const setMap = (newMapId: string | null) => {
        if (newMapId) {
            navigate(`/${view}/${newMapId}`);
        }
    };

    const setRegion = (newRegionId: string | null) => {
        if (!newRegionId) {
            return;
        }

        navigate(`/${view}/${activeMapId}/${newRegionId}/${subView || SubView.Description}`);
    };

    const setSubView = (newSubView?: SubView | null) => {
        navigate(`/${view}/${activeMapId}/${regionId}/${newSubView || SubView.Description}`);
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
