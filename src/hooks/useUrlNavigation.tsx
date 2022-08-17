import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { URL_BASENAME } from '../constants';
import { RouteName, SubView } from '../enums';
import { getActiveMapId } from '../state';
import { UrlParts } from '../types';
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

    const getHref = (parts: Partial<UrlParts>) => {
        let href = `${window.location.origin}${URL_BASENAME}`;

        if (parts.view) {
            href = `${href}/${parts.view}`;

            if (parts.activeMapId) {
                href = `${href}/${parts.activeMapId}`;

                if (parts.regionId) {
                    href = `${href}/${parts.regionId}/${parts.subView || SubView.Description}`;
                }
            }
        }

        return href;
    };

    return {
        getUrlParts,
        setView,
        setMap,
        setRegion,
        setSubView,
        getHref,
        navigate,
        location,
    };
};
