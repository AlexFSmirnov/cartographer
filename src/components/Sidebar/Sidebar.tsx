import { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Close, FileDownload, FileUpload, Map, UploadFile } from '@mui/icons-material';
import { Divider, Drawer } from '@mui/material';
import { CONFIGURATION_FILETYPE } from '../../constants';
import {
    closeSidebar,
    exportProject,
    getIsDarkModeEnabled,
    getIsEditModeEnabled,
    getIsSidebarOpen,
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
}) => {
    const { getImageDataUrl, setImageDataUrl } = useImagesContext();

    const [isImportConfigurationDialogOpen, setIsImportConfigurationDialogOpen] = useState(false);

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
                            <SidebarButton divider icon={<UploadFile />} onClick={() => {}}>
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
                title="Import project data"
                contentText="Select a project configuration to import. The regions, maps, images and notes in the configuration will overwrite the ones currently stored in this project!"
                acceptFiletype={CONFIGURATION_FILETYPE}
                onClose={handleImportConfigurationDialogClose}
                onUpload={handleImportConfiguration}
            />
        </>
    );
};

export const Sidebar = connectSidebar(SidebarBase);
