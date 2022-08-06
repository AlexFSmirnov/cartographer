import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Typography } from '@mui/material';
import { RouteName } from '../../enums';
import { parseUrl } from '../../utils';
import { getCurrentProjectRegions } from '../../state';
import { Region } from '../../types';

interface StateProps {
    currentProjectRegions: Record<string, Region>;
}

type TitleProps = StateProps;

const TitleBase: React.FC<TitleProps> = ({ currentProjectRegions }) => {
    const location = useLocation();
    const { view, activeMap } = parseUrl(location.pathname);

    const isMapNotFound = useMemo(
        () => view === RouteName.Map && activeMap !== null && !currentProjectRegions[activeMap],
        [activeMap, currentProjectRegions, view]
    );

    if (isMapNotFound) {
        return null;
    }

    if (view !== RouteName.Map) {
        return (
            <Box
                width="100%"
                height="56px"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h4" sx={{ fontWeight: 300 }}>
                    {view === null && 'The project is empty'}
                    {view === RouteName.Notes && 'Notes'}
                    {view === RouteName.Regions && 'Regions'}
                </Typography>
            </Box>
        );
    }

    return (
        <Box width="100%" height="56px" display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 300 }}>
                Bread/Crumbs/Will/Be/Here/{activeMap}
            </Typography>
        </Box>
    );
};

export const Title = connect(
    createStructuredSelector({
        currentProjectRegions: getCurrentProjectRegions,
    })
)(TitleBase);
