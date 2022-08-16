import { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Typography } from '@mui/material';
import { StoreProps } from '../../types';
import { RouteName } from '../../enums';
import { useUrlNavigation } from '../../hooks';
import { getCurrentProjectMaps } from '../../state';

const connectTitle = connect(
    createStructuredSelector({
        currentProjectMaps: getCurrentProjectMaps,
    })
);

type TitleProps = StoreProps<typeof connectTitle>;

const TitleBase: React.FC<TitleProps> = ({ currentProjectMaps }) => {
    const { getUrlParts } = useUrlNavigation();
    const { view, activeMapId } = getUrlParts();

    const isMapNotFound = useMemo(
        () => view === RouteName.Map && activeMapId !== null && !currentProjectMaps[activeMapId],
        [activeMapId, currentProjectMaps, view]
    );

    if (isMapNotFound) {
        return null;
    }

    let content;
    if (view === RouteName.Map) {
        content = (
            <Typography variant="h4" sx={{ fontWeight: 300 }}>
                Bread/Crumbs/Will/Be/Here/{activeMapId}
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

export const Title = connectTitle(TitleBase);
