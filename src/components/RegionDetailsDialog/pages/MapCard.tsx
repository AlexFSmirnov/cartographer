import { Cancel, Check, Close, Delete, Edit } from '@mui/icons-material';
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
import { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
    deleteImage,
    deleteMap,
    getCurrentProjectMaps,
    getIsEditModeEnabled,
    openAlertDialog,
    updateImageId,
    updateMap,
} from '../../../state';
import { Map, StoreProps } from '../../../types';
import { RegionPreview } from '../../RegionPreview';

const connectMapCard = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
        isEditModeEnabled: getIsEditModeEnabled,
    }),
    {
        updateMap,
        updateImageId,
        deleteMap,
        deleteImage,
        openAlertDialog,
    }
);

interface MapCardProps extends StoreProps<typeof connectMapCard> {
    map: Map;
}

const MAP_CARD_HEIGHT = 125;
const MAP_CARD_PREVIEW_WIDTH = 160;

const MapCardBase: React.FC<MapCardProps> = ({
    map,
    maps,
    isEditModeEnabled,
    updateMap,
    updateImageId,
    deleteMap,
    deleteImage,
    openAlertDialog,
}) => {
    const [previewWidth, setPreviewWidth] = useState(MAP_CARD_PREVIEW_WIDTH);

    const [editingMap, setEditingMap] = useState<Map | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const previewContainerRef = (container: HTMLDivElement | null) => {
        window.requestAnimationFrame(() => {
            if (container) {
                const { width } = container.getBoundingClientRect();
                setPreviewWidth(width);
            }
        });
    };

    const handleDeleteButtonClick = () => setIsDeleteDialogOpen(true);
    const handleDeleteCancel = () => setIsDeleteDialogOpen(false);
    const handleDeleteConfirm = () => {
        deleteMap({ mapId: map.id });
        deleteImage({ id: map.id });
    };

    const handleEditButtonClick = () => setEditingMap(map);
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

    let content: React.ReactNode = null;

    if (editingMap) {
        const { id, name, floorNumber } = editingMap;
        const isConfirmDisabled = !id || !name;

        content = (
            <>
                <Box display="flex" justifyContent="space-between">
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: '23%' }}
                        label="Code"
                        value={id || ''}
                        onChange={handleMapChange('id')}
                    />
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: '73%' }}
                        label="Title"
                        value={name || ''}
                        onChange={handleMapChange('name')}
                    />
                </Box>
                <Box flexGrow={1} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <TextField
                        variant="filled"
                        size="small"
                        sx={{ width: '50%' }}
                        label="Floor"
                        value={floorNumber || ''}
                        onChange={handleMapChange('floorNumber')}
                    />
                    <Box flexGrow={1} />
                    <Box height="40px">
                        <IconButton onClick={handleEditCancel}>
                            <Close />
                        </IconButton>
                        <IconButton onClick={handleEditConfirm} disabled={isConfirmDisabled}>
                            <Check />
                        </IconButton>
                    </Box>
                </Box>
            </>
        );
    } else {
        const { id, name, floorNumber } = map;
        content = (
            <>
                <Tooltip title={`${id}. ${name}`}>
                    <Typography variant="h5" noWrap>
                        {id}. {name}
                    </Typography>
                </Tooltip>
                <Box pt={1} />
                {floorNumber !== null && (
                    <Typography variant="body1" fontStyle="italic">
                        Floor {floorNumber}
                    </Typography>
                )}
                <Box flexGrow={1} />
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
                <Box
                    height="100%"
                    maxWidth={MAP_CARD_PREVIEW_WIDTH}
                    padding="8px"
                    ref={previewContainerRef}
                >
                    <RegionPreview doesRegionExist mapId={map.id} regionId={null} />
                </Box>
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
