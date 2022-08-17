import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { URL_BASENAME } from '../../constants';
import { RouteName, SubView, UrlParts } from '../../types';
import { getActiveMapId } from '../../state';

const parseUrl = (url: string): UrlParts => {
    const parts = url.split('/');

    if (parts.length <= 1) {
        return { view: null, activeMapId: null, regionId: null, subView: SubView.Description };
    }

    const view = (parts[1] as RouteName) || null;
    const activeMapId = parts[2] || null;
    const regionId = parts[3] || null;
    const subView = (parts[4] as SubView) || SubView.Description;

    return { view, activeMapId, regionId, subView };
};

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
        parseUrl,
        navigate,
        location,
    };
};
