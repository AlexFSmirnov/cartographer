import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { Region, SubView } from '../../../types';
import { useUrlNavigation } from '../../../utils';
import { RegionPreview } from '../../RegionPreview';

const CARD_MIN_HEIGHT = 80;
const PREVIEW_WIDTH = 120;

interface ReferenceCardProps {
    referencedId: string;
    region: Region;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({ referencedId, region }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const snapshotLength = isMobile ? 10 : 25;

    const { getHref, setUrlParts } = useUrlNavigation();

    const [cardHeight, setCardHeight] = useState(CARD_MIN_HEIGHT);

    const textContainerRef = (textContainer: HTMLDivElement | null) => {
        if (!textContainer) {
            return;
        }

        const { height } = textContainer.getBoundingClientRect();
        setCardHeight(Math.max(height + 16, CARD_MIN_HEIGHT));
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

            const snapshotStart = index - snapshotLength;
            let snapshotPrefix = condencedDescription
                .slice(Math.max(0, snapshotStart), index)
                .trim();
            if (snapshotStart > 0) {
                snapshotPrefix = `...${snapshotPrefix}`;
            }

            const snapshotEnd = index + regionTagLength + snapshotLength;
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
                    height: cardHeight,
                }}
                elevation={2}
            >
                <Box height="100%" width={PREVIEW_WIDTH} padding="8px">
                    <RegionPreview
                        doesRegionExist
                        mapId={region.parentMapId}
                        regionId={region.id}
                    />
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    pl={1}
                    width={`calc(100% - ${PREVIEW_WIDTH}px)`}
                    ref={textContainerRef}
                >
                    <Typography variant="h6">
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
