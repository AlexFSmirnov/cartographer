import { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Button, Typography } from '@mui/material';
import { getCurrentProjectMaps, getIsEditModeEnabled, openUploadMapDialog } from '../../../state';
import { StoreProps } from '../../../types';
import { useUrlNavigation } from '../../../utils';
import { FlexBox } from '../../FlexBox';
import { MapCard } from './MapCard';

const connectMapsPage = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
        isEditModeEnabled: getIsEditModeEnabled,
    }),
    {
        openUploadMapDialog,
    }
);

type MapsPageProps = StoreProps<typeof connectMapsPage>;

const MapsPageBase: React.FC<MapsPageProps> = ({
    maps,
    isEditModeEnabled,
    openUploadMapDialog,
}) => {
    const { getUrlParts } = useUrlNavigation();
    const { regionId } = getUrlParts();

    const childMaps = useMemo(() => {
        return Object.values(maps).filter(
            (map) => map.parentRegionId && map.parentRegionId === regionId
        );
    }, [regionId, maps]);

    const handleUploadClick = () => openUploadMapDialog({ type: 'child' });

    if (childMaps.length === 0) {
        return (
            <FlexBox fullHeight pt={4} column alignX="center">
                <Typography variant="body1">
                    This region has no child maps assigned to it.
                </Typography>
                <Box pt={2} />
                {isEditModeEnabled && (
                    <Button onClick={handleUploadClick} variant="outlined">
                        Add child map
                    </Button>
                )}
            </FlexBox>
        );
    }

    return (
        <Box overflow="auto" mt={1}>
            {childMaps.map((map) => (
                <MapCard key={map.id} map={map} />
            ))}
            {isEditModeEnabled && (
                <FlexBox alignX="center" mt={1} mb={4}>
                    <Button variant="outlined" onClick={handleUploadClick}>
                        Add child map
                    </Button>
                </FlexBox>
            )}
        </Box>
    );
};

export const MapsPage = connectMapsPage(MapsPageBase);
