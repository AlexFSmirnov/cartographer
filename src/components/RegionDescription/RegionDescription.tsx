import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Tab, Tabs, TextField, Typography } from '@mui/material';
import {
    getCurrentProjectMapIds,
    getCurrentProjectRegionsByMap,
    setRegionDescription,
} from '../../state';
import { StoreProps } from '../../types';
import { useUrlNavigation } from '../../utils';
import { DescriptionBlockquote } from '../DescriptionBlockquote';
import { FlexBox } from '../FlexBox';
import { RegionLink } from '../RegionLink';

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

const TAB_HEIGHT = 48;
const BASE_LINE_HEIGHT = 24;

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

    const inputFieldRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPreviewing, setIsPreviewing] = useState(false);
    const [inputRows, setInputRows] = useState(1);
    const [previewHeight, setPreviewHeight] = useState(0);

    useEffect(() => {
        const { current: container } = containerRef;
        if (!container) {
            return;
        }

        const resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(container);

        return () => resizeObserver.unobserve(container);
    });

    const updateSize = useCallback(() => {
        const { current: container } = containerRef;
        if (!container) {
            return;
        }

        const { height } = container.getBoundingClientRect();

        if (!isEditing) {
            setPreviewHeight(height);
            return;
        }

        let lineHeight = BASE_LINE_HEIGHT;
        const { current: inputField } = inputFieldRef;
        if (inputField) {
            const { lineHeight: styleLineHeight } = window.getComputedStyle(inputField);

            if (styleLineHeight && parseInt(styleLineHeight)) {
                lineHeight = parseInt(styleLineHeight);
            }
        }

        const inputFieldPadding = lineHeight * 1.5;
        const availableHeight = height - TAB_HEIGHT - inputFieldPadding;
        const rows = Math.floor(availableHeight / (lineHeight - 1));

        setInputRows(rows);
        setPreviewHeight(rows * (lineHeight - 1) + inputFieldPadding);
    }, [isEditing]);

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
            rows={inputRows}
            value={ownDescription}
            onChange={handleDescriptionChange}
            ref={inputFieldRef}
        />
    );

    const preview = (
        <Box p={1} height={previewHeight} overflow="auto">
            <ReactMarkdown
                components={{
                    h1: ({ children }) => <Typography variant="h3">{children}</Typography>,
                    h2: ({ children }) => (
                        <Typography variant="h2" sx={{ fontSize: '22pt' }}>
                            {children}
                        </Typography>
                    ),
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
                    p: ({ children }) => <Box pb={2}>{children}</Box>,
                    img: (props) => (
                        <FlexBox fullWidth maxHeight={300} center>
                            <img
                                alt=""
                                {...props}
                                style={{ maxWidth: '100%', maxHeight: '300px' }}
                            />
                        </FlexBox>
                    ),
                }}
            >
                {descriptionWithLinks}
            </ReactMarkdown>
        </Box>
    );

    return (
        <FlexBox column flexGrow={1} ref={containerRef}>
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
