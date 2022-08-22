import { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Close, FileDownload, FileUpload, Map, UploadFile } from '@mui/icons-material';
import { DialogContentText, Divider, Drawer, Paper } from '@mui/material';
import { CONFIGURATION_FILETYPE } from '../../constants';
import {
    closeSidebar,
    exportProject,
    getIsDarkModeEnabled,
    getIsEditModeEnabled,
    getIsSidebarOpen,
    importDescriptions,
    importProject,
    openUploadMapDialog,
    toggleDarkMode,
    toggleEditMode,
} from '../../state';
import { StoreProps } from '../../types';
import { useImagesContext } from '../../utils';
import { ProjectSelect } from '../ProjectSelect';
import { SidebarButton } from '../SidebarButton';
import { UploadFileDialog } from '../UploadFileDialog';
import { SidebarItemsContainer } from './style';

const connectSidebar = connect(
    createStructuredSelector({
        isSidebarOpen: getIsSidebarOpen,
        isEditModeEnabled: getIsEditModeEnabled,
        isDarkModeEnabled: getIsDarkModeEnabled,
    }),
    {
        closeSidebar,
        toggleEditMode,
        toggleDarkMode,
        openUploadMapDialog,
        exportProject,
        importProject,
        importDescriptions,
    }
);

type SidebarProps = StoreProps<typeof connectSidebar>;

const SidebarBase: React.FC<SidebarProps> = ({
    isSidebarOpen,
    isEditModeEnabled,
    isDarkModeEnabled,
    closeSidebar,
    toggleEditMode,
    toggleDarkMode,
    openUploadMapDialog,
    exportProject,
    importProject,
    importDescriptions,
}) => {
    const { getImageDataUrl, setImageDataUrl } = useImagesContext();

    const [isImportConfigurationDialogOpen, setIsImportConfigurationDialogOpen] = useState(false);
    const [isImportDescriptionsDialogOpen, setIsImportDescriptionsDialogOpen] = useState(false);

    const handleUploadRootMapButtonClick = () => {
        openUploadMapDialog({ type: 'root' });
        closeSidebar();
    };

    const handleSidebarClose = () => closeSidebar();
    const handleEditModeClick = () => toggleEditMode();
    const handleDarkModeClick = () => toggleDarkMode();

    const handleExportProjectClick = () => {
        exportProject(getImageDataUrl);
    };

    const handleImportProjectClick = () => {
        setIsImportConfigurationDialogOpen(true);
    };
    const handleImportConfigurationDialogClose = () => {
        setIsImportConfigurationDialogOpen(false);
    };
    const handleImportConfiguration = (file: File) => {
        importProject({ file, setImageDataUrl });
    };

    const handleImportDescriptionsClick = () => setIsImportDescriptionsDialogOpen(true);
    const handleImportDescriptionsDialogClose = () => setIsImportDescriptionsDialogOpen(false);
    const handleImportDescriptions = (file: File) => {
        importDescriptions(file);
    };

    return (
        <>
            <Drawer anchor="left" open={isSidebarOpen} onClose={handleSidebarClose}>
                <SidebarItemsContainer>
                    <ProjectSelect />
                    <SidebarButton
                        divider
                        icon={<FileDownload />}
                        onClick={handleExportProjectClick}
                    >
                        Export project data
                    </SidebarButton>
                    <SidebarButton divider icon={<FileUpload />} onClick={handleImportProjectClick}>
                        Import project data
                    </SidebarButton>
                    <div style={{ height: '64px' }} />
                    <Divider />
                    <SidebarButton
                        divider
                        toggle
                        isActive={isEditModeEnabled}
                        onClick={handleEditModeClick}
                    >
                        Edit mode
                    </SidebarButton>
                    {isEditModeEnabled && (
                        <>
                            <SidebarButton
                                divider
                                icon={<Map />}
                                onClick={handleUploadRootMapButtonClick}
                            >
                                Upload root map
                            </SidebarButton>
                            <SidebarButton
                                divider
                                icon={<UploadFile />}
                                onClick={handleImportDescriptionsClick}
                            >
                                Import descriptions
                            </SidebarButton>
                        </>
                    )}
                    <div style={{ flexGrow: 1 }} />
                    <Divider />
                    <SidebarButton
                        divider
                        toggle
                        isActive={isDarkModeEnabled}
                        onClick={handleDarkModeClick}
                    >
                        Dark mode
                    </SidebarButton>
                    <SidebarButton icon={<Close />} onClick={handleSidebarClose}>
                        Close
                    </SidebarButton>
                </SidebarItemsContainer>
            </Drawer>
            <UploadFileDialog
                open={isImportConfigurationDialogOpen}
                acceptFiletype={CONFIGURATION_FILETYPE}
                onClose={handleImportConfigurationDialogClose}
                onUpload={handleImportConfiguration}
                title="Import project data"
                content={
                    <>
                        <DialogContentText>
                            Select a project configuration to import.
                        </DialogContentText>
                        <DialogContentText>
                            The regions, maps, images and notes in the configuration will overwrite
                            the ones currently stored in this project!
                        </DialogContentText>
                    </>
                }
            />
            <UploadFileDialog
                open={isImportDescriptionsDialogOpen}
                acceptFiletype="md"
                onClose={handleImportDescriptionsDialogClose}
                onUpload={handleImportDescriptions}
                dropzoneHeight={150}
                title="Import descriptions"
                content={
                    <>
                        <DialogContentText>
                            Select a markdown file containing the bulk descriptions for your
                            existing regions.
                        </DialogContentText>
                        <DialogContentText>
                            Each description instance begins with a region code, prefixed by{' '}
                            <code>!#</code> and folloed by a period. Then, the region name follows
                            for on the same line. Description markdown follows on the next lines,
                            terminated by three dashes.
                        </DialogContentText>
                        <DialogContentText>For example:</DialogContentText>
                        <Paper elevation={2} sx={{ padding: 1 }}>
                            <code>
                                <p>!# R1. Region Number One </p>
                                <p>This is the first region.</p>
                                <p>{'>'} It can have quotes,</p>
                                <p>## headers</p>
                                <p>and **bold** text.</p>
                                <br />
                                <p>---</p>
                                <br />
                                <p>!# R2. Region Number Two</p>
                                <p>This is the second region.</p>
                            </code>
                        </Paper>
                    </>
                }
            />
        </>
    );
};

export const Sidebar = connectSidebar(SidebarBase);
