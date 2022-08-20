import { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Typography } from '@mui/material';
import { StoreProps, RouteName } from '../../types';
import { useUrlNavigation } from '../../utils';
import { getCurrentProjectMaps } from '../../state';
import { FlexBox } from '../FlexBox';

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
        <FlexBox fullWidth center height="64px">
            {content}
        </FlexBox>
    );
};

export const Title = connectTitle(TitleBase);
