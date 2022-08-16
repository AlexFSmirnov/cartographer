import { RouteName, SubView } from '../enums';

interface ParseUrlResult {
    view: RouteName | null;
    activeMapId: string | null;
    regionId: string | null;
    subView: SubView;
}

export const parseUrl = (url: string): ParseUrlResult => {
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
