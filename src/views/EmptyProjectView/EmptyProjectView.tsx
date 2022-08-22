import { connect } from 'react-redux';
import { Box, Button, Divider, Typography } from '@mui/material';
import { FlexBox } from '../../components';
import { openUploadMapDialog } from '../../state';
import { StoreProps } from '../../types';

const connectEmptyProjectView = connect(null, { openUploadMapDialog });

type EmptyProjectViewProps = StoreProps<typeof connectEmptyProjectView>;

const EmptyProjectViewBase: React.FC<EmptyProjectViewProps> = ({ openUploadMapDialog }) => (
    <FlexBox fullWidth fullHeight column center>
        <Typography variant="body1">
            You can start working on this project by adding a map
        </Typography>
        <FlexBox width="200px" alignX="space-between" alignY="center">
            <Divider sx={{ width: '35%' }} />
            <Typography variant="body1">or</Typography>
            <Divider sx={{ width: '35%' }} />
        </FlexBox>
        <Typography variant="body1">load an example project for a tutorial</Typography>
        <FlexBox mt={4} width="360px" maxWidth="90%" center>
            <Button color="inherit" variant="outlined" disabled>
                Load tutorial project
            </Button>
            <Box px={0.5} />
            <Button variant="outlined" onClick={() => openUploadMapDialog({ type: 'root' })}>
                Add root map
            </Button>
        </FlexBox>
    </FlexBox>
);

export const EmptyProjectView = connectEmptyProjectView(EmptyProjectViewBase);
