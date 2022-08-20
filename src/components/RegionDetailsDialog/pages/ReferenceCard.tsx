import { Box, Paper, Typography } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { Region, SubView } from '../../../types';
import { useUrlNavigation } from '../../../utils';
import { RegionPreview } from '../../RegionPreview';

const SNAPSHOT_LENGTH = 25;
const MAP_CARD_PREVIEW_WIDTH = 120;

interface ReferenceCardProps {
    referencedId: string;
    region: Region;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({ referencedId, region }) => {
    const { getHref, setUrlParts } = useUrlNavigation();

    const [previewWidth, setPreviewWidth] = useState(MAP_CARD_PREVIEW_WIDTH);

    const previewContainerRef = useRef<HTMLDivElement>(null);
    const handlePreviewLoad = () => {
        const { current: container } = previewContainerRef;
        if (container) {
            const { width } = container.getBoundingClientRect();
            setPreviewWidth(width);
        }
    };

    const descriptionSnapshots = useMemo(() => {
        const { description } = region;

        const regionIdRegexp = new RegExp(`\\[${referencedId}\\]`, 'g');
        const matches = description.matchAll(regionIdRegexp);

        const regionTagLength = referencedId.length + 2;

        return Array.from(matches).map(({ index }) => {
            if (index === null || index === undefined) {
                return null;
            }

            const condencedDescription = description.replaceAll('\n', ' ');

            const snapshotStart = index - SNAPSHOT_LENGTH;
            let snapshotPrefix = condencedDescription
                .slice(Math.max(0, snapshotStart), index)
                .trim();
            if (snapshotStart > 0) {
                snapshotPrefix = `...${snapshotPrefix}`;
            }

            const snapshotEnd = index + regionTagLength + SNAPSHOT_LENGTH;
            let snapshotSuffix = condencedDescription
                .slice(index + regionTagLength, Math.min(snapshotEnd, condencedDescription.length))
                .trim();
            if (snapshotEnd < condencedDescription.length) {
                snapshotSuffix = `${snapshotSuffix}...`;
            }

            return {
                snapshotPrefix,
                snapshotSuffix,
            };
        });
    }, [region, referencedId]);

    const handleCardClick = (e: React.MouseEvent) => {
        setUrlParts({
            activeMapId: region.parentMapId,
            regionId: region.id,
            subView: SubView.Description,
        });
        e.preventDefault();
    };

    const cardHref = getHref({
        activeMapId: region.parentMapId,
        regionId: region.id,
        subView: SubView.Description,
    });

    return (
        <a
            href={cardHref}
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={handleCardClick}
        >
            <Paper
                sx={{
                    margin: '8px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                }}
                elevation={4}
            >
                <Box
                    height="100%"
                    maxWidth={MAP_CARD_PREVIEW_WIDTH}
                    padding="8px"
                    ref={previewContainerRef}
                >
                    <RegionPreview
                        doesRegionExist
                        mapId={region.parentMapId}
                        regionId={region.id}
                        onImageLoad={handlePreviewLoad}
                    />
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    pl={1}
                    width={`calc(100% - ${previewWidth}px)`}
                >
                    <Typography variant="h5">
                        {region.id}. {region.name}
                    </Typography>
                    {descriptionSnapshots.map(
                        (snapshot, index) =>
                            snapshot !== null && (
                                <Box
                                    key={snapshot.snapshotPrefix + snapshot.snapshotSuffix + index}
                                >
                                    <Typography variant="body2" noWrap>
                                        {snapshot.snapshotPrefix}{' '}
                                        <Typography
                                            variant="body2"
                                            component="span"
                                            color="primary"
                                        >
                                            [{referencedId}]
                                        </Typography>{' '}
                                        {snapshot.snapshotSuffix}
                                    </Typography>
                                </Box>
                            )
                    )}
                </Box>
            </Paper>
        </a>
    );
};
