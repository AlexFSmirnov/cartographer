import { Box, Tab, Tabs, TextField } from '@mui/material';
import { useState } from 'react';

interface OwnProps {
    description: string;
    isEditing?: boolean;
    onChange: (description: string) => void;
}

interface StateProps {}

type RegionDescriptionProps = OwnProps & StateProps;

const RegionDescriptionBase: React.FC<RegionDescriptionProps> = ({
    description,
    isEditing,
    onChange,
}) => {
    const [isPreviewing, setIsPreviewing] = useState(false);

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column">
            <Tabs
                value={isPreviewing ? 1 : 0}
                onChange={(_, value) => setIsPreviewing(value === 1)}
                variant="fullWidth"
            >
                <Tab label="Edit" />
                <Tab label="Preview" />
            </Tabs>
            <TextField
                label="Description"
                variant="filled"
                multiline
                fullWidth
                rows={10}
                value={description}
                onChange={handleDescriptionChange}
            />
        </Box>
    );
};

export const RegionDescription = RegionDescriptionBase;
