import { connect } from 'react-redux';
import { Menu } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { openSidebar } from '../../state';
import { StoreProps } from '../../types';
import { TopMenuButtonWrapper } from './style';

const connectTopMenuButton = connect(null, { openSidebar });

type TopMenuButtonProps = StoreProps<typeof connectTopMenuButton>;

const TopMenuButtonBase: React.FC<TopMenuButtonProps> = ({ openSidebar }) => (
    <TopMenuButtonWrapper>
        <IconButton onClick={() => openSidebar()}>
            <Menu />
        </IconButton>
    </TopMenuButtonWrapper>
);

export const TopMenuButton = connectTopMenuButton(TopMenuButtonBase);
