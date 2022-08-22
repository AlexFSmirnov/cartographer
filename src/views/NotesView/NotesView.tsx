import { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FlexBox } from '../../components';
import { getCurrentProjectAllRegions } from '../../state';
import { StoreProps } from '../../types';
import { NoteCard } from './components';

const connectNotesView = connect(
    createStructuredSelector({
        allRegions: getCurrentProjectAllRegions,
    })
);

type NotesViewProps = StoreProps<typeof connectNotesView>;

const NotesViewBase: React.FC<NotesViewProps> = ({ allRegions }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const regionsWithNotes = useMemo(() => allRegions.filter(({ notes }) => !!notes), [allRegions]);

    if (regionsWithNotes.length === 0) {
        return (
            <FlexBox fullWidth center pt={2}>
                <Typography variant="h5">You have no notes on any regions.</Typography>
            </FlexBox>
        );
    }

    return (
        <FlexBox fullWidth fullHeight alignX="center" overflow="auto">
            <FlexBox column fullWidth maxHeight="100%" maxWidth={isMobile ? '100%' : '800px'}>
                {regionsWithNotes.map((region) => (
                    <NoteCard key={region.id} region={region} />
                ))}
                <Box minHeight={100} />
            </FlexBox>
        </FlexBox>
    );
};

export const NotesView = connectNotesView(NotesViewBase);
