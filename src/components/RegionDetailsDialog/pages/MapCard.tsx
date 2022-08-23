import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Check, Close, Delete, Edit } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import {
    deleteMapOrRegion,
    getCurrentProjectMaps,
    getIsEditModeEnabled,
    openAlertDialog,
    updateMap,
} from '../../../state';
import { Map, StoreProps } from '../../../types';
import { useImagesContext, useUrlNavigation } from '../../../utils';
import { FlexBox } from '../../FlexBox';
import { RegionPreview } from '../../RegionPreview';

const connectMapCard = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
        isEditModeEnabled: getIsEditModeEnabled,
    }),
    {
        updateMap,
        deleteMapOrRegion,
        openAlertDialog,
    }
);

interface MapCardProps extends StoreProps<typeof connectMapCard> {
    map: Map;
}

const MAP_CARD_HEIGHT = 120;
const PREVIEW_WIDTH = 160;

const MapCardBase: React.FC<MapCardProps> = ({
    map,
    maps,
    isEditModeEnabled,
    updateMap,
    deleteMapOrRegion,
    openAlertDialog,
}) => {
    const { getHref, setUrlParts } = useUrlNavigation();

    const { updateImageId, deleteImage } = useImagesContext();

    const [editingMap, setEditingMap] = useState<Map | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDeleteButtonClick = (e: React.MouseEvent) => {
        setIsDeleteDialogOpen(true);
        e.stopPropagation();
    };
    const handleDeleteCancel = () => setIsDeleteDialogOpen(false);
    const handleDeleteConfirm = () => {
        deleteMapOrRegion({ mapId: map.id, regionId: null, deleteImage });
    };

    const handleEditButtonClick = (e: React.MouseEvent) => {
        setEditingMap(map);
        e.stopPropagation();
    };
    const handleEditCancel = () => setEditingMap(null);

    const handleEditConfirm = () => {
        if (editingMap) {
            const existingMap = maps[editingMap.id];
            if (existingMap && map.id !== editingMap.id) {
                openAlertDialog(
                    `Map with code ${existingMap.id} (${existingMap.name}) already exists.`
                );
                return;
            }

            updateMap({ oldId: map.id, map: editingMap });
            if (map.id !== editingMap.id) {
                updateImageId({ oldId: map.id, newId: editingMap.id });
            }
            setEditingMap(null);
        }
    };

    const handleMapChange = (prop: keyof Map) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingMap) {
            setEditingMap({ ...editingMap, [prop]: e.target.value || null });
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if (!editingMap) {
            setUrlParts({ activeMapId: map.id, regionId: null });
        }

        e.preventDefault();
    };

    let content: React.ReactNode = null;

    const cardHref = getHref({ activeMapId: map.id });

    if (editingMap) {
        const { id, name } = editingMap;
        const isConfirmDisabled = !id || !name;

        content = (
            <>
                <TextField
                    variant="filled"
                    size="small"
                    label="Title"
                    fullWidth
                    value={name || ''}
                    onChange={handleMapChange('name')}
                />
                <Box flexGrow={1} />
                <FlexBox alignY="center">
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: '23%' }}
                        label="Code"
                        value={id || ''}
                        onChange={handleMapChange('id')}
                    />
                    <Box flexGrow={1} />
                    <IconButton onClick={handleEditCancel}>
                        <Close />
                    </IconButton>
                    <IconButton onClick={handleEditConfirm} disabled={isConfirmDisabled}>
                        <Check />
                    </IconButton>
                </FlexBox>
            </>
        );
    } else {
        const { id, name } = map;
        content = (
            <>
                <a
                    href={cardHref}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    onClick={handleCardClick}
                >
                    <Typography variant="h6" noWrap>
                        {id}.
                    </Typography>
                    <Typography variant="h6" noWrap>
                        {name}
                    </Typography>
                    <Box flexGrow={1} />
                </a>
                {isEditModeEnabled && (
                    <FlexBox alignX="flex-end">
                        <IconButton onClick={handleEditButtonClick}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={handleDeleteButtonClick}>
                            <Delete />
                        </IconButton>
                    </FlexBox>
                )}
            </>
        );
    }

    return (
        <>
            <Paper
                sx={{
                    height: MAP_CARD_HEIGHT,
                    minHeight: MAP_CARD_HEIGHT,
                    margin: '8px',
                    display: 'flex',
                }}
                elevation={2}
            >
                <a href={cardHref} onClick={handleCardClick}>
                    <Box height="100%" width={PREVIEW_WIDTH} padding="8px">
                        <RegionPreview doesRegionExist mapId={map.id} regionId={null} />
                    </Box>
                </a>
                <FlexBox column p={1} width={`calc(100% - ${PREVIEW_WIDTH}px)`}>
                    {content}
                </FlexBox>
            </Paper>
            <Dialog open={isDeleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Delete map</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {map.id} ({map.name})?
                    </DialogContentText>
                    <DialogContentText>
                        This will delete all of its child regions and maps!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={handleDeleteCancel}>
                        Cancel
                    </Button>
                    <Button color="error" onClick={handleDeleteConfirm}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const MapCard = connectMapCard(MapCardBase);
