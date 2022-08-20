import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Close, FileDownload, FileUpload, Map, UploadFile } from '@mui/icons-material';
import { Divider, Drawer } from '@mui/material';
import {
    closeSidebar,
    getIsDarkModeEnabled,
    getIsEditModeEnabled,
    getIsSidebarOpen,
    openUploadMapDialog,
    toggleDarkMode,
    toggleEditMode,
} from '../../state';
import { StoreProps } from '../../types';
import { ProjectSelect } from '../ProjectSelect';
import { SidebarButton } from '../SidebarButton';
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
}) => {
    const handleUploadRootMapButtonClick = () => {
        openUploadMapDialog({ type: 'root' });
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

export const Sidebar = connectSidebar(SidebarBase);
