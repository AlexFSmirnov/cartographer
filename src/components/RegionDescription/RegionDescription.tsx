import { useCallback, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Tab, Tabs, TextField, Typography } from '@mui/material';
import { DescriptionBlockquote } from '../DescriptionBlockquote';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getCurrentProjectMapIds, getCurrentProjectRegionsByMap } from '../../state';
import { RegionLink } from '../RegionLink';

interface OwnProps {
    description: string;
    isEditing?: boolean;
    onChange: (description: string) => void;
}

interface StateProps {
    currentProjectMapIds: string[];
    currentProjectRegionsByMap: ReturnType<typeof getCurrentProjectRegionsByMap>;
}

type RegionDescriptionProps = OwnProps & StateProps;

const RegionDescriptionBase: React.FC<RegionDescriptionProps> = ({
    description,
    isEditing,
    currentProjectMapIds,
    currentProjectRegionsByMap,
    onChange,
}) => {
    const [isPreviewing, setIsPreviewing] = useState(false);

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const getDescriptionWithLinks = useCallback(
        (description: string) => {
            return description.replaceAll(/\[(.+?)\]/g, (match: string, regionId: string) => {
                for (const [mapId, regions] of Object.entries(currentProjectRegionsByMap)) {
                    if (regions[regionId]) {
                        return `[${regionId}](/${mapId}/${regionId})`;
                    }
                }

                if (currentProjectMapIds.includes(regionId)) {
                    return `[${regionId}](/${regionId})`;
                }

                return match;
            });
        },
        [currentProjectMapIds, currentProjectRegionsByMap]
    );

    const descriptionWithLinks = useMemo(
        () => getDescriptionWithLinks(description),
        [description, getDescriptionWithLinks]
    );

    const inputField = (
        <TextField
            label="Description"
            variant="filled"
            multiline
            fullWidth
            autoFocus
            rows={15}
            value={description}
            onChange={handleDescriptionChange}
        />
    );

    const preview = (
        <Box p={1} width="100%" height="378px" maxHeight="378px" overflow="auto">
            <ReactMarkdown
                components={{
                    h1: ({ children }) => <Typography variant="h2">{children}</Typography>,
                    h2: ({ children }) => <Typography variant="h3">{children}</Typography>,
                    ul: ({ children }) => <ul style={{ paddingLeft: '1em' }}>{children}</ul>,
                    ol: ({ children }) => <ol style={{ paddingLeft: '1em' }}>{children}</ol>,
                    blockquote: ({ children }) => (
                        <DescriptionBlockquote>{children}</DescriptionBlockquote>
                    ),
                    a: ({ children, href }) => (
                        <RegionLink relativeHref={href} isClickable={!isEditing}>
                            {children}
                        </RegionLink>
                    ),
                }}
            >
                {descriptionWithLinks}
            </ReactMarkdown>
        </Box>
    );

    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column">
            <Tabs
                value={isPreviewing ? 1 : 0}
                onChange={(_, value) => setIsPreviewing(value === 1)}
                variant="fullWidth"
            >
                <Tab label="Edit" />
                <Tab label="Preview" />
            </Tabs>
            {isPreviewing ? preview : inputField}
        </Box>
    );
};

export const RegionDescription = connect(
    createStructuredSelector({
        currentProjectMapIds: getCurrentProjectMapIds,
        currentProjectRegionsByMap: getCurrentProjectRegionsByMap,
    })
)(RegionDescriptionBase);
