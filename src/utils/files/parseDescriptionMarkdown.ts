interface ParsedRegion {
    id: string;
    name: string;
    description: string;
}

export const parseDescriptionMarkdown = (description: string) => {
    const result: Record<string, ParsedRegion> = {};

    description.split('---').forEach((regionDescription) => {
        const processedDescription = regionDescription.trim().replaceAll('\r\n', '\n');

        const [title, ...descriptionLines] = processedDescription.split('\n');
        const descriptionMarkdown = descriptionLines.join('\n');

        const match = title.match(/!# (.+?)\. (.+)$/);
        if (match) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, id, name] = match;

            result[id] = {
                id,
                name,
                description: descriptionMarkdown,
            };
        }
    });

    return result;
};
