import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Button, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { Map, StoreProps } from '../../../types';
import { useUrlNavigation } from '../../../hooks';
import {
    getCurrentProjectMaps,
    getIsEditModeEnabled,
    openAlertDialog,
    openUploadMapDialog,
} from '../../../state';
import { RegionPreview } from '../../RegionPreview';
import { Delete, Edit } from '@mui/icons-material';
import { MapCard } from './MapCard';

const connectMapsPage = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
        isEditModeEnabled: getIsEditModeEnabled,
    }),
    {
        openUploadMapDialog,
        openAlertDialog,
    }
);

type MapsPageProps = StoreProps<typeof connectMapsPage>;

const MapsPageBase: React.FC<MapsPageProps> = ({
    maps,
    isEditModeEnabled,
    openUploadMapDialog,
    openAlertDialog,
}) => {
    const { getUrlParts } = useUrlNavigation();
    const { regionId, activeMapId } = getUrlParts();

    const [editingMap, setEditingMap] = useState<Map | null>(null);

    const childMaps = useMemo(
        () => Object.values(maps).filter((map) => map.parent && map.parent === regionId),
        [regionId, maps]
    );

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

    console.log(childMaps);

    const childMaps2 = [...childMaps, ...childMaps, ...childMaps, ...childMaps, ...childMaps];
    const childMaps3 = [
        ...childMaps,
        {
            id: 'ROOT',
            name: 'Root Map',
            parent: null,
        },
    ];

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
