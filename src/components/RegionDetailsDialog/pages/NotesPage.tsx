import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { StoreProps } from '../../../types';
import { getCurrentProjectRegionsByMap, setRegionNotes } from '../../../state';

const connectNotesPage = connect(
    createStructuredSelector({
        regionsByMap: getCurrentProjectRegionsByMap,
    }),
    {
        setRegionNotes,
    }
);

interface NotesPageProps extends StoreProps<typeof connectNotesPage> {
    regionId: string;
}

const NotesPageBase: React.FC<NotesPageProps> = ({ regionId, regionsByMap, setRegionNotes }) => {
    return <div>test</div>;
};

export const NotesPage = connectNotesPage(NotesPageBase);
