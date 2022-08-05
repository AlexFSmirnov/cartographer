import { connect } from 'react-redux';
import { Box, Button, Divider, Typography } from '@mui/material';
import { openUploadMapDialog } from '../../state';
import { EmptyProjectViewContainer } from './style';

interface DispatchProps {
    openUploadMapDialog: typeof openUploadMapDialog;
}

type EmptyProjectViewProps = DispatchProps;

const EmptyProjectViewBase: React.FC<EmptyProjectViewProps> = ({ openUploadMapDialog }) => (
    <EmptyProjectViewContainer>
        <Typography variant="body1">
            You can start working on this project by adding a map
        </Typography>
        <Box width="200px" display="flex" justifyContent="space-between" alignItems="center">
            <Divider sx={{ width: '35%' }} />
            <Typography variant="body1">or</Typography>
            <Divider sx={{ width: '35%' }} />
        </Box>
        <Typography variant="body1">load an example project for a tutorial</Typography>
        <Box
            mt={4}
            width="360px"
            maxWidth="90%"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Button color="inherit" variant="outlined" disabled>
                Load example project
            </Button>
            <Box px={0.5} />
            <Button variant="outlined" onClick={() => openUploadMapDialog()}>
                Add root map
            </Button>
        </Box>
    </EmptyProjectViewContainer>
);

export const EmptyProjectView = connect(null, {
    openUploadMapDialog,
})(EmptyProjectViewBase);
