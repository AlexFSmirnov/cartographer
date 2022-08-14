import { Rect } from './Rect';

export interface Region {
    id: string;
    name: string;
    description: string;
    notes: string;
    references: string[];
    referencedBy: string[];
    parentRect: Rect;
}
