import { RouteName, SubView } from '../enums';

interface ParseUrlResult {
    view: RouteName | null;
    activeMap: string | null;
    region: string | null;
    subView: SubView;
}

export const parseUrl = (url: string): ParseUrlResult => {
    const parts = url.split('/');

    if (parts.length <= 1) {
        return { view: null, activeMap: null, region: null, subView: SubView.Description };
    }

    const view = (parts[1] as RouteName) || null;
    const activeMap = parts[2] || null;
    const region = parts[3] || null;
    const subView = (parts[4] as SubView) || SubView.Description;

    return { view, activeMap, region, subView };
};
