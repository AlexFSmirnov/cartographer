import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Divider, Drawer } from '@mui/material';
import { Close, FileDownload, FileUpload, Map, UploadFile } from '@mui/icons-material';
import {
    closeSidebar,
    getIsDarkModeEnabled,
    getIsEditModeEnabled,
    getIsSidebarOpen,
    openUploadMapDialog,
    toggleDarkMode,
    toggleEditMode,
} from '../../state';
import { SidebarButton } from '../SidebarButton';
import { ProjectSelect } from '../ProjectSelect';
import { SidebarItemsContainer } from './style';

interface StateProps {
    isSidebarOpen: boolean;
    isEditModeEnabled: boolean;
    isDarkModeEnabled: boolean;
}

interface DispatchProps {
    closeSidebar: () => void;
    toggleEditMode: () => void;
    toggleDarkMode: () => void;
    openUploadMapDialog: () => void;
}

type SidebarProps = StateProps & DispatchProps;

const SidebarBase: React.FC<SidebarProps> = ({
    isSidebarOpen,
    isEditModeEnabled,
    isDarkModeEnabled,
    closeSidebar,
    toggleEditMode,
    toggleDarkMode,
    openUploadMapDialog,
}) => {
    const handleUploadRootMapButtonClick = () => {
        openUploadMapDialog();
        closeSidebar();
    };

    const handleSidebarClose = () => closeSidebar();
    const handleEditModeClick = () => toggleEditMode();
    const handleDarkModeClick = () => toggleDarkMode();

    return (
        <Drawer anchor="left" open={isSidebarOpen} onClose={handleSidebarClose}>
            <SidebarItemsContainer>
                <ProjectSelect />
                <SidebarButton divider icon={<FileDownload />} onClick={() => {}}>
                    Export project data
                </SidebarButton>
                <SidebarButton divider icon={<FileUpload />} onClick={() => {}}>
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
    );
};

export const Sidebar = connect(
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
    }
)(SidebarBase);
