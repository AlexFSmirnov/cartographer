import { Box, Typography } from '@mui/material';
import { connect } from 'react-redux';

const TitleBase = () => {
    return (
        <Box width="100%" height="56px" display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 300 }}>
                The project is empty.
            </Typography>
        </Box>
    );
};

export const Title = connect(null)(TitleBase);
