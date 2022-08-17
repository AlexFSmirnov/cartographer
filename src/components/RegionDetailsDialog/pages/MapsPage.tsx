import { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Button, Typography } from '@mui/material';
import { StoreProps } from '../../../types';
import { useUrlNavigation } from '../../../hooks';
import { getCurrentProjectMaps, getIsEditModeEnabled, openUploadMapDialog } from '../../../state';
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
        return Object.values(maps).filter((map) => map.parent && map.parent === regionId);
    }, [regionId, maps]);

    const handleUploadClick = () => openUploadMapDialog({ type: 'child' });

    if (childMaps.length === 0) {
        return (
            <Box
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                flexDirection="column"
            >
                <Box pt={4} />
                <Typography variant="body1">
                    This region has no child maps assigned to it.
                </Typography>
                <Box pt={2} />
                {isEditModeEnabled && (
                    <Button onClick={handleUploadClick} variant="outlined">
                        Add child map
                    </Button>
                )}
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" height="100%" overflow="auto">
            {childMaps.map((map) => (
                <MapCard key={map.id} map={map} />
            ))}
            {isEditModeEnabled && (
                <Box display="flex" justifyContent="center" mt={1} mb={4}>
                    <Button variant="outlined" onClick={handleUploadClick}>
                        Add child map
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export const MapsPage = connectMapsPage(MapsPageBase);
