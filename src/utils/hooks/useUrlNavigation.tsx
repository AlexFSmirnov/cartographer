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

    const setUrlParts = (newParts: Partial<UrlParts>) => {
        const newView = newParts.view || view;
        const newActiveMapId = newParts.activeMapId || activeMapId || stateActiveMapId;
        const newRegionId = newParts.regionId || regionId;
        const newSubView = newParts.subView || subView || SubView.Description;

        if (newParts.regionId === null || !newRegionId) {
            navigate(`/${newView}/${newActiveMapId}`);
        } else {
            navigate(`/${newView}/${newActiveMapId}/${newRegionId}/${newSubView}`);
        }
    };

    const getHref = (parts: Partial<UrlParts>) => {
        const urlView = parts.view || view || RouteName.Map;
        const urlSubView = parts.subView || subView || SubView.Description;

        let href = `${window.location.origin}${URL_BASENAME}/${urlView}`;

        if (parts.activeMapId) {
            href = `${href}/${parts.activeMapId}`;

            if (parts.regionId) {
                href = `${href}/${parts.regionId}/${urlSubView}`;
            }
        }

        return href;
    };

    return {
        getUrlParts,
        setUrlParts,
        getHref,
        parseUrl,
        navigate,
        location,
    };
};
