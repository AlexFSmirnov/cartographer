import { useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ReactMarkdown from 'react-markdown';
import { Box, Tab, Tabs, TextField, Typography } from '@mui/material';
import { StoreProps } from '../../types';
import { useUrlNavigation } from '../../utils';
import {
    getCurrentProjectMapIds,
    getCurrentProjectRegionsByMap,
    setRegionDescription,
} from '../../state';
import { DescriptionBlockquote } from '../DescriptionBlockquote';
import { RegionLink } from '../RegionLink';
import { FlexBox } from '../FlexBox';

const connectRegionDescription = connect(
    createStructuredSelector({
        currentProjectMapIds: getCurrentProjectMapIds,
        currentProjectRegionsByMap: getCurrentProjectRegionsByMap,
    }),
    {
        setRegionDescription,
    }
);

interface OwnPropsBase {
    isEditing?: boolean;
    doesRegionExist?: boolean;

    description?: string;
    onChange?: (description: string) => void;

    regionId?: string;
    activeMapId?: string;
}

interface OwnProps1 extends OwnPropsBase {
    doesRegionExist: true;

    description?: undefined;
    onChange?: undefined;
}

interface OwnProps2 extends OwnPropsBase {
    doesRegionExist: false;

    description: string;
    onChange: (description: string) => void;
}

type OwnProps = OwnProps1 | OwnProps2;

type RegionDescriptionProps = OwnProps & StoreProps<typeof connectRegionDescription>;

const RegionDescriptionBase: React.FC<RegionDescriptionProps> = ({
    doesRegionExist,
    description,
    isEditing,
    currentProjectMapIds,
    currentProjectRegionsByMap,
    onChange,
    setRegionDescription,
}) => {
    const { getUrlParts } = useUrlNavigation();
    const { regionId, activeMapId } = getUrlParts();

    const [isPreviewing, setIsPreviewing] = useState(false);

    const ownDescription = useMemo(() => {
        if (doesRegionExist) {
            if (regionId && activeMapId) {
                const region = currentProjectRegionsByMap[activeMapId][regionId];
                return region?.description || '';
            }
            return '';
        } else {
            return description;
        }
    }, [currentProjectRegionsByMap, activeMapId, regionId, description, doesRegionExist]);

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (doesRegionExist) {
            if (regionId && activeMapId) {
                setRegionDescription({
                    regionId,
                    activeMapId,
                    description: e.target.value,
                });
            }
        } else {
            onChange(e.target.value);
        }
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
        () => getDescriptionWithLinks(ownDescription),
        [ownDescription, getDescriptionWithLinks]
    );

    const inputField = (
        <TextField
            label="Description"
            variant="filled"
            multiline
            fullWidth
            autoFocus
            rows={15}
            value={ownDescription}
            onChange={handleDescriptionChange}
        />
    );

    const previewHeight = isEditing ? '378px' : '426px';

    const preview = (
        <Box p={1} height={previewHeight} overflow="auto">
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
        <FlexBox fullHeight column>
            {isEditing && (
                <Tabs
                    value={isPreviewing ? 1 : 0}
                    onChange={(_, value) => setIsPreviewing(value === 1)}
                    variant="fullWidth"
                >
                    <Tab label="Edit" />
                    <Tab label="Preview" />
                </Tabs>
            )}
            {isPreviewing || !isEditing ? preview : inputField}
        </FlexBox>
    );
};

export const RegionDescription = connectRegionDescription(RegionDescriptionBase);
