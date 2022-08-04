import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Divider, Drawer } from '@mui/material';
import {
    closeSidebar,
    getIsDarkModeEnabled,
    getIsEditModeEnabled,
    getIsSidebarOpen,
    toggleDarkMode,
    toggleEditMode,
} from '../../state';
import { ProjectSelect } from '../ProjectSelect';
import { SidebarItemsContainer } from './style';
import { SidebarButton } from '../SidebarButton';
import {
    Close,
    FileDownload,
    FileUpload,
    Map,
    PlusOne,
    Publish,
    UploadFile,
} from '@mui/icons-material';

interface StateProps {
    isSidebarOpen: boolean;
    isEditModeEnabled: boolean;
    isDarkModeEnabled: boolean;
}

interface DispatchProps {
    closeSidebar: () => void;
    toggleEditMode: () => void;
    toggleDarkMode: () => void;
}

type SidebarProps = StateProps & DispatchProps;

const SidebarBase: React.FC<SidebarProps> = ({
    isSidebarOpen,
    isEditModeEnabled,
    isDarkModeEnabled,
    closeSidebar,
    toggleEditMode,
    toggleDarkMode,
}) => {
    return (
        <Drawer anchor="left" open={true} onClose={closeSidebar}>
            <SidebarItemsContainer>
                <ProjectSelect />
                <SidebarButton divider icon={<FileDownload />} onClick={() => {}}>
                    Export configuration
                </SidebarButton>
                <SidebarButton divider icon={<FileUpload />} onClick={() => {}}>
                    Import configuration
                </SidebarButton>
                <div style={{ height: '64px' }} />
                <Divider />
                <SidebarButton divider toggle isActive={isEditModeEnabled} onClick={toggleEditMode}>
                    Edit mode
                </SidebarButton>
                {isEditModeEnabled && (
                    <>
                        <SidebarButton divider icon={<Map />} onClick={() => {}}>
                            Upload new map
                        </SidebarButton>
                        <SidebarButton divider icon={<UploadFile />} onClick={() => {}}>
                            Import descriptions
                        </SidebarButton>
                    </>
                )}
                <div style={{ flexGrow: 1 }} />
                <Divider />
                <SidebarButton divider toggle isActive={isDarkModeEnabled} onClick={toggleDarkMode}>
                    Dark mode
                </SidebarButton>
                <SidebarButton icon={<Close />} onClick={() => {}}>
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
    }
)(SidebarBase);
