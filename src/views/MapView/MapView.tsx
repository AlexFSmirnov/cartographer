import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseUrl } from '../../routing';
import { getCurrentProjectRegionIds } from '../../state';
import { EmptyProjectView } from '../EmptyProjectView';
import { NotFound } from '../NotFound';

interface StateProps {
    currentProjectRegionIds: string[];
}

type MapViewProps = StateProps;

const MapViewBase: React.FC<MapViewProps> = ({ currentProjectRegionIds }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { activeMap, region, subView } = parseUrl(location.pathname);

    // if (!currentProjectRegionIds.includes(activeMap)) {
    //     return <NotFound />;
    // }

    return (
        <>
            <div>Map</div>
        </>
    );
};

export const MapView = connect(
    createStructuredSelector({
        currentProjectRegionIds: getCurrentProjectRegionIds,
    })
)(MapViewBase);
