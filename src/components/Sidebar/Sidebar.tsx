import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Drawer } from '@mui/material';
import { closeSidebar, getIsSidebarOpen } from '../../state';
import { ProjectSelect } from '../ProjectSelect';
import { SidebarItemsContainer } from './style';

interface StateProps {
    isSidebarOpen: boolean;
}

interface DispatchProps {
    closeSidebar: () => void;
}

type SidebarProps = StateProps & DispatchProps;

const SidebarBase: React.FC<SidebarProps> = ({ isSidebarOpen, closeSidebar }) => {
    return (
        <Drawer anchor="left" open={true} onClose={closeSidebar}>
            <SidebarItemsContainer>
                <ProjectSelect />
            </SidebarItemsContainer>
        </Drawer>
    );
};

export const Sidebar = connect(
    createStructuredSelector({
        isSidebarOpen: getIsSidebarOpen,
    }),
    {
        closeSidebar,
    }
)(SidebarBase);
