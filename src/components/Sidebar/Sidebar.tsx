import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Drawer } from '@mui/material';
import { closeSidebar, getIsSidebarOpen } from '../../state';

interface StateProps {
    isSidebarOpen: boolean;
}

interface DispatchProps {
    closeSidebar: () => void;
}

type SidebarProps = StateProps & DispatchProps;

const SidebarBase: React.FC<SidebarProps> = ({ isSidebarOpen, closeSidebar }) => {
    return (
        <Drawer anchor="left" open={isSidebarOpen} onClose={closeSidebar}>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
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
