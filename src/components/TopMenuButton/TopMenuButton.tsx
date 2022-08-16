import { connect } from 'react-redux';
import { IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { StoreProps } from '../../types';
import { openSidebar } from '../../state';
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
