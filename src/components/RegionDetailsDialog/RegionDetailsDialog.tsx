import { Close, Delete, Edit } from '@mui/icons-material';
import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tab,
    Tabs,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { SubView } from '../../enums';
import { useUrlNavigation } from '../../hooks';
import { getCurrentProjectAllRegions, getIsEditModeEnabled } from '../../state';
import { Region } from '../../types';
import { RegionDescription } from '../RegionDescription';
import { NotFoundPage } from './pages';

interface StateProps {
    isEditModeEnabled: boolean;
    regions: Region[];
}

type RegionDetailsDialogProps = StateProps;

const SUB_VIEW_ORDER = [SubView.Description, SubView.Maps, SubView.Notes, SubView.References];

const RegionDetailsDialogBase: React.FC<RegionDetailsDialogProps> = ({
    isEditModeEnabled,
    regions,
}) => {
    const { setView, setSubView, getUrlParts } = useUrlNavigation();
    const { view, activeMap: activeMapId, region: regionId, subView } = getUrlParts();

    const [region, setRegion] = useState<Region | null>(null);
    useEffect(() => {
        const region = regions.find((r) => r.id === regionId);
        if (regionId && region) {
            setRegion(region);
        }
    }, [regions, regionId, setRegion]);

    const tabValue = useMemo(() => SUB_VIEW_ORDER.indexOf(subView), [subView]);

    const handleClose = () => {
        setView(view);
    };

    const handleTabChange = (_: unknown, value: number) => {
        setSubView(SUB_VIEW_ORDER[value]);
    };

    const isOpen = regionId !== null;

    let dialogContent: React.ReactNode = null;
    if (!region) {
        dialogContent = <NotFoundPage onClose={handleClose} />;
    } else {
        const { id, name, description, notes, references, referencedBy } = region;

        dialogContent = (
            <>
                <DialogTitle
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingBottom: 0,
                    }}
                >
                    <div>
                        {id}. {name}
                    </div>
                    <Box flexGrow={1} />
                    {!isEditModeEnabled && subView === SubView.Description && (
                        <IconButton>
                            <Edit />
                        </IconButton>
                    )}
                    <IconButton>
                        <Delete />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '600px',
                        maxWidth: '100%',
                        height: '494px',
                        maxHeight: '100%',
                    }}
                >
                    <Box width="100%" height="100%" display="flex" flexDirection="column">
                        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                            {SUB_VIEW_ORDER.map((subView) => (
                                <Tab key={subView} label={subView} />
                            ))}
                        </Tabs>
                    </Box>
                    {subView === SubView.Description && (
                        <RegionDescription
                            isEditing={false}
                            description={description}
                            onChange={() => {}}
                        />
                    )}
                </DialogContent>
            </>
        );
    }

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            {dialogContent}
        </Dialog>
    );
};

export const RegionDetailsDialog = connect(
    createStructuredSelector({
        isEditModeEnabled: getIsEditModeEnabled,
        regions: getCurrentProjectAllRegions,
    })
)(RegionDetailsDialogBase);
