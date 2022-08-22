import { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Typography } from '@mui/material';
import { getCurrentProjectMaps } from '../../state';
import { StoreProps, RouteName } from '../../types';
import { useUrlNavigation } from '../../utils';
import { FlexBox } from '../FlexBox';
import { MapBreadcrumbs } from './MapBreadcrumbs';

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

    if (view === RouteName.Map) {
        return (
            <FlexBox fullWidth center height="80px" minHeight="80px">
                <MapBreadcrumbs mapId={activeMapId} />
            </FlexBox>
        );
    }

    return (
        <FlexBox fullWidth center height="64px" minHeight="64px">
            <Typography variant="h4" sx={{ fontWeight: 300 }}>
                {view === null && 'The project is empty'}
                {view === RouteName.Notes && 'Notes'}
                {view === RouteName.Regions && 'Regions'}
            </Typography>
        </FlexBox>
    );
};

export const Title = connectTitle(TitleBase);
