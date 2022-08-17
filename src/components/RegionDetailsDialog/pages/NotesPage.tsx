import { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { TextField } from '@mui/material';
import { StoreProps } from '../../../types';
import { getCurrentProjectRegionsByMap, setRegionNotes } from '../../../state';
import { useUrlNavigation } from '../../../hooks';

const connectNotesPage = connect(
    createStructuredSelector({
        regionsByMap: getCurrentProjectRegionsByMap,
    }),
    {
        setRegionNotes,
    }
);

type NotesPageProps = StoreProps<typeof connectNotesPage>;

const NotesPageBase: React.FC<NotesPageProps> = ({ regionsByMap, setRegionNotes }) => {
    const { getUrlParts } = useUrlNavigation();
    const { regionId, activeMapId } = getUrlParts();

    const notes = useMemo(() => {
        if (regionId && activeMapId) {
            return regionsByMap[activeMapId][regionId].notes;
        }
        return null;
    }, [activeMapId, regionId, regionsByMap]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (regionId && activeMapId) {
            setRegionNotes({
                regionId,
                activeMapId,
                notes: e.target.value,
            });
        }
    };

    return (
        <TextField
            label="Notes"
            variant="filled"
            multiline
            fullWidth
            autoFocus
            rows={17}
            value={notes}
            onChange={handleChange}
        />
    );
};

export const NotesPage = connectNotesPage(NotesPageBase);