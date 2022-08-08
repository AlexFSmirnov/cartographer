import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Typography } from '@mui/material';
import { RouteName } from '../../enums';
import { parseUrl } from '../../utils';
import { getCurrentProjectMaps } from '../../state';
import { Map } from '../../types';

interface StateProps {
    currentProjectMaps: Record<string, Map>;
}

type TitleProps = StateProps;

const TitleBase: React.FC<TitleProps> = ({ currentProjectMaps }) => {
    const location = useLocation();
    const { view, activeMap } = parseUrl(location.pathname);

    const isMapNotFound = useMemo(
        () => view === RouteName.Map && activeMap !== null && !currentProjectMaps[activeMap],
        [activeMap, currentProjectMaps, view]
    );

    if (isMapNotFound) {
        return null;
    }

    let content;
    if (view === RouteName.Map) {
        content = (
            <Typography variant="h4" sx={{ fontWeight: 300 }}>
                Bread/Crumbs/Will/Be/Here/{activeMap}
            </Typography>
        );
    } else {
        content = (
            <Typography variant="h4" sx={{ fontWeight: 300 }}>
                {view === null && 'The project is empty'}
                {view === RouteName.Notes && 'Notes'}
                {view === RouteName.Regions && 'Regions'}
            </Typography>
        );
    }

    return (
        <Box width="100%" height="64px" display="flex" justifyContent="center" alignItems="center">
            {content}
        </Box>
    );
};

export const Title = connect(
    createStructuredSelector({
        currentProjectMaps: getCurrentProjectMaps,
    })
)(TitleBase);
