import { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Paper, Typography } from '@mui/material';
import { RegionPreview } from '../../../components';
import { getCurrentProjectMaps, getCurrentProjectRegionsByMap } from '../../../state';
import { Region, StoreProps, SubView } from '../../../types';
import { getParentChain, useUrlNavigation } from '../../../utils';

const CARD_MIN_HEIGHT = 80;
const CARD_MAX_HEIGHT = 150;
const PREVIEW_WIDTH = 150;

const connectNoteCard = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
        regionsByMap: getCurrentProjectRegionsByMap,
    })
);

interface NoteCardProps extends StoreProps<typeof connectNoteCard> {
    region: Region;
}

const NoteCardBase: React.FC<NoteCardProps> = ({ region, maps, regionsByMap }) => {
    const { setUrlParts, getHref } = useUrlNavigation();

    const [cardHeight, setCardHeight] = useState(CARD_MIN_HEIGHT);

    const textContainerRef = (textContainer: HTMLDivElement | null) => {
        if (!textContainer) {
            return;
        }

        const { height } = textContainer.getBoundingClientRect();
        setCardHeight(Math.max(height + 16, CARD_MIN_HEIGHT));
    };

    const parentChain = getParentChain({ region, maps, regionsByMap });

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
                    minHeight: cardHeight,
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
                    height="100%"
                    pl={1}
                    width={`calc(100% - ${PREVIEW_WIDTH}px)`}
                    ref={textContainerRef}
                >
                    <Typography variant="h6">
                        <span style={{ opacity: 0.6 }}>
                            {parentChain.map((r) => r.id).join('/')}/
                        </span>
                        {region.id}. {region.name}
                    </Typography>
                    <Box maxHeight={CARD_MAX_HEIGHT} overflow="auto">
                        {region.notes.split('\n').map((line, index) => (
                            <Typography key={`${line}-${index}`} variant="body2">
                                {line}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            </Paper>
        </a>
    );
};

export const NoteCard = connectNoteCard(NoteCardBase);
