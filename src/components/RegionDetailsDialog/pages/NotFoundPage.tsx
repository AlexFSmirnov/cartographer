import { Close } from '@mui/icons-material';
import { Box, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { FlexBox } from '../../FlexBox';

interface NotFoundPageProps {
    onClose: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onClose }) => {
    return (
        <>
            <DialogTitle
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>Region not found</div>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <FlexBox column alignX="center">
                    <img
                        src={`${process.env.PUBLIC_URL}/404.png`}
                        alt="404"
                        style={{ maxWidth: '80%' }}
                    />
                    <Box mt={2} />
                    <DialogContentText>Here lie uncharted lands, stranger.</DialogContentText>
                </FlexBox>
            </DialogContent>
        </>
    );
};
