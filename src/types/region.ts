import { Rect } from './Rect';

export interface Region {
    id: string;
    name: string;
    description: string;
    notes: string;
    floorNumber: string | null;
    references: string[];
    referencedBy: string[];

    root: boolean;
    parent: string | null;
    parentRect: Rect | null;
}

export interface RootRegion {
    id: string;
    name: string;
}
