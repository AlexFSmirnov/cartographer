import { RouteName, SubView } from '../enums';

export interface UrlParts {
    view: RouteName | null;
    activeMapId: string | null;
    regionId: string | null;
    subView: SubView;
}
