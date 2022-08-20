import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
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
    Tooltip,
    Typography,
} from '@mui/material';
import { Check, Close, Delete, Edit } from '@mui/icons-material';
import { Map, StoreProps } from '../../../types';
import {
    deleteMap,
    getCurrentProjectMaps,
    getIsEditModeEnabled,
    openAlertDialog,
    updateMap,
} from '../../../state';
import { RegionPreview } from '../../RegionPreview';
import { useImagesContext, useUrlNavigation } from '../../../utils';

const connectMapCard = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
        isEditModeEnabled: getIsEditModeEnabled,
    }),
    {
        updateMap,
        deleteMap,
        openAlertDialog,
    }
);

interface MapCardProps extends StoreProps<typeof connectMapCard> {
    map: Map;
}

const MAP_CARD_HEIGHT = 120;
const MAP_CARD_PREVIEW_WIDTH = 160;

const MapCardBase: React.FC<MapCardProps> = ({
    map,
    maps,
    isEditModeEnabled,
    updateMap,
    deleteMap,
    openAlertDialog,
}) => {
    const { getHref, setUrlParts } = useUrlNavigation();

    const { updateImageId, deleteImage } = useImagesContext();

    const [previewWidth, setPreviewWidth] = useState(MAP_CARD_PREVIEW_WIDTH);

    const [editingMap, setEditingMap] = useState<Map | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const previewContainerRef = useRef<HTMLDivElement>(null);
    const handlePreviewLoad = () => {
        const { current: container } = previewContainerRef;
        if (container) {
            const { width } = container.getBoundingClientRect();
            setPreviewWidth(width);
        }
    };

    const handleDeleteButtonClick = (e: React.MouseEvent) => {
        setIsDeleteDialogOpen(true);
        e.stopPropagation();
    };
    const handleDeleteCancel = () => setIsDeleteDialogOpen(false);
    const handleDeleteConfirm = () => {
        deleteMap({ mapId: map.id });
        deleteImage(map.id);
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
                <Box display="flex" alignItems="center">
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
                </Box>
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
                    <Typography variant="h5" noWrap>
                        {id}.
                    </Typography>
                    <Tooltip title={name}>
                        <Typography variant="h5" noWrap>
                            {name}
                        </Typography>
                    </Tooltip>
                    <Box flexGrow={1} />
                </a>
                {isEditModeEnabled && (
                    <Box display="flex" justifyContent="flex-end">
                        <IconButton onClick={handleEditButtonClick}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={handleDeleteButtonClick}>
                            <Delete />
                        </IconButton>
                    </Box>
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
                elevation={4}
            >
                <a href={cardHref} onClick={handleCardClick}>
                    <Box
                        height="100%"
                        maxWidth={MAP_CARD_PREVIEW_WIDTH}
                        padding="8px"
                        ref={previewContainerRef}
                    >
                        <RegionPreview
                            doesRegionExist
                            mapId={map.id}
                            regionId={null}
                            onImageLoad={handlePreviewLoad}
                        />
                    </Box>
                </a>
                <Box
                    display="flex"
                    flexDirection="column"
                    padding="8px"
                    width={`calc(100% - ${previewWidth}px)`}
                >
                    {content}
                </Box>
            </Paper>
            <Dialog open={isDeleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Delete map</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {map.id} ({map.name})?
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
