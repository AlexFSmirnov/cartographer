import { RouteName, SubView } from '../enums';

interface ParseUrlResult {
    view: RouteName | null;
    activeMap: string | null;
    region: string | null;
    subView: SubView | null;
}

export const parseUrl = (url: string): ParseUrlResult => {
    const parts = url.split('/');

    if (parts.length <= 1) {
        return { view: null, activeMap: null, region: null, subView: null };
    }

    const view = (parts[1] as RouteName) || null;

    let activeMap = null;
    let region = parts[2] || null;
    let subView = (parts[3] as SubView) || SubView.Description;

    if (view === RouteName.Map) {
        activeMap = parts[2] || null;
        region = parts[3] || null;
        subView = (parts[4] as SubView) || SubView.Description;
    }

    return { view, activeMap, region, subView };
};
