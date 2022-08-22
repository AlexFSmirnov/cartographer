import { connect } from 'react-redux';
import { Box, Button, Divider, Typography } from '@mui/material';
import { FlexBox } from '../../components';
import { importTutorialProject, openUploadMapDialog } from '../../state';
import { StoreProps } from '../../types';
import { useImagesContext } from '../../utils';

const connectEmptyProjectView = connect(null, { openUploadMapDialog, importTutorialProject });

type EmptyProjectViewProps = StoreProps<typeof connectEmptyProjectView>;

const EmptyProjectViewBase: React.FC<EmptyProjectViewProps> = ({
    openUploadMapDialog,
    importTutorialProject,
}) => {
    const { setImageDataUrl } = useImagesContext();

    const handleAddRootMapClick = () => openUploadMapDialog({ type: 'root' });
    const handleLoadTutorialProjectClick = () => importTutorialProject(setImageDataUrl);

    return (
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
                <Button onClick={handleLoadTutorialProjectClick}>Load tutorial project</Button>
                <Box px={0.5} />
                <Button variant="outlined" onClick={handleAddRootMapClick}>
                    Add root map
                </Button>
            </FlexBox>
        </FlexBox>
    );
};

export const EmptyProjectView = connectEmptyProjectView(EmptyProjectViewBase);
