import { Box, Typography } from '@mui/material';
import { NotFoundContainer } from './style';

const NotFound = () => {
    return (
        <NotFoundContainer>
            <Typography variant="h1">404</Typography>
            <img src={`${process.env.PUBLIC_URL}/404.png`} alt="404" style={{ maxWidth: '80%' }} />
            <Box pb={6} />
            <Typography variant="h5">Here lie uncharted lands, stranger.</Typography>
        </NotFoundContainer>
    );
};

export default NotFound;
