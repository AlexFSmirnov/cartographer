import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { CircularProgress } from '@mui/material';
import { getIsFullscreenDialogOpen } from '../../state';
import { StoreProps } from '../../types';
import { FlexBox } from '../FlexBox';
import { FullscreenLoaderContainer } from './style';

const connectFullscreenLoader = connect(
    createStructuredSelector({
        isFullscreenLoaderOpen: getIsFullscreenDialogOpen,
    })
);

type FullscreenLoaderProps = StoreProps<typeof connectFullscreenLoader>;

const FullscreenLoaderBase: React.FC<FullscreenLoaderProps> = ({ isFullscreenLoaderOpen }) => {
    if (!isFullscreenLoaderOpen) {
        return null;
    }

    return (
        <FullscreenLoaderContainer>
            <FlexBox fullWidth fullHeight center>
                <CircularProgress />
            </FlexBox>
        </FullscreenLoaderContainer>
    );
};

export const FullscreenLoader = connectFullscreenLoader(FullscreenLoaderBase);
