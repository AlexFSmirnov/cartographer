import { connect } from 'react-redux';
import { IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { openSidebar } from '../../state';
import { TopMenuButtonWrapper } from './style';

interface DispatchProps {
    openSidebar: () => void;
}

type TopMenuButtonProps = DispatchProps;

const TopMenuButtonBase: React.FC<TopMenuButtonProps> = ({ openSidebar }) => (
    <TopMenuButtonWrapper>
        <IconButton onClick={openSidebar}>
            <Menu />
        </IconButton>
    </TopMenuButtonWrapper>
);

export const TopMenuButton = connect(null, {
    openSidebar,
})(TopMenuButtonBase);
