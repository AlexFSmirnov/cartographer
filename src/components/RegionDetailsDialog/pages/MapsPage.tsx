import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Button, Typography } from '@mui/material';
import { StoreProps } from '../../../types';
import { useUrlNavigation } from '../../../hooks';
import { getCurrentProjectMaps, openUploadMapDialog } from '../../../state';

const connectMapsPage = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
    }),
    {
        openUploadMapDialog,
    }
);

type MapsPageProps = StoreProps<typeof connectMapsPage>;

const MapsPageBase: React.FC<MapsPageProps> = ({ maps, openUploadMapDialog }) => {
    const { getUrlParts } = useUrlNavigation();
    const { regionId, activeMapId } = getUrlParts();

    const childMaps = useMemo(
        () => Object.values(maps).filter((map) => map.parent && map.parent === regionId),
        [regionId, maps]
    );

    const handleUploadClick = () => openUploadMapDialog({ type: 'child' });

    let content: React.ReactNode = null;

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
                <Button onClick={handleUploadClick} variant="outlined">
                    Add child map
                </Button>
            </Box>
        );
    }

    return <>{content}</>;
};

export const MapsPage = connectMapsPage(MapsPageBase);
