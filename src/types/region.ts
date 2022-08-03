export interface Region {
    id: string;
    name: string;
    description: string;
    notes: string;
    floorNumber: string | null;
    references: string[];
    referencedBy: string[];

    parent: string | null;
    parentRect: [number, number, number, number] | null;
}
