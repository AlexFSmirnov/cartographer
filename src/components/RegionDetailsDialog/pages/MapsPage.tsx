import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Button, Typography } from '@mui/material';
import { StoreProps } from '../../../types';
import { useUrlNavigation } from '../../../hooks';
import { getCurrentProjectMaps } from '../../../state';
import { UploadChildMapDialog } from '../../UploadChildMapDialog';

const connectMapsPage = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
    })
);

type MapsPageProps = StoreProps<typeof connectMapsPage>;

const MapsPageBase: React.FC<MapsPageProps> = ({ maps }) => {
    const { getUrlParts } = useUrlNavigation();
    const { region: regionId, activeMap: activeMapId } = getUrlParts();

    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    const childMaps = useMemo(
        () => Object.values(maps).filter((map) => map.parent && map.parent === regionId),
        [regionId, maps]
    );

    const handleUploadClick = () => setIsUploadDialogOpen(true);
    const handleUploadDialogClose = () => setIsUploadDialogOpen(false);

    let content: React.ReactNode = null;

    if (childMaps.length === 0) {
        content = (
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

    return (
        <>
            {content}
            <UploadChildMapDialog isOpen={isUploadDialogOpen} onClose={handleUploadDialogClose} />
        </>
    );
};

export const MapsPage = connectMapsPage(MapsPageBase);
