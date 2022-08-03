import { RouteName, SubView } from './enums';

interface ParseUrlResult {
    view: RouteName | null;
    region: string | null;
    subView: SubView | null;
}

export const parseUrl = (url: string): ParseUrlResult => {
    const parts = url.split('/');

    if (parts.length <= 1) {
        return { view: null, region: null, subView: null };
    }

    const view = (parts[1] as RouteName) || null;
    const region = parts[2] || null;
    const subView = (parts[3] as SubView) || SubView.Description;

    return { view, region, subView };
};
