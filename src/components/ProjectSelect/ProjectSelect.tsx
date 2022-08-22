import { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Add, Check, Edit, ExpandMore } from '@mui/icons-material';
import {
    Dialog,
    DialogActions,
    DialogContent,
    Button,
    DialogTitle,
    IconButton,
    ListItem,
    Popover,
    styled,
    TextField,
    Typography,
    useTheme,
    Box,
} from '@mui/material';
import {
    createProject,
    getCurrentProjectName,
    getSavedProjectsNamesAndIds,
    openProject,
    setCurrentProjectName,
} from '../../state';
import { StoreProps } from '../../types';
import { FlexBox } from '../FlexBox';
import {
    ProjectSelectContainer,
    ProjectSelectIconWrapper,
    ProjectSelectItemsContainer,
} from './style';

const connectProjectSelect = connect(
    createStructuredSelector({
        currentProjectName: getCurrentProjectName,
        savedProjectsNamesAndIds: getSavedProjectsNamesAndIds,
    }),
    {
        setCurrentProjectName,
        openProject,
        createProject,
    }
);

type ProjectSelectProps = StoreProps<typeof connectProjectSelect>;

const ProjectSelectTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        color: theme.palette.primary.contrastText,
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: theme.palette.primary.contrastText,
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.primary.contrastText,
    },
}));

const ProjectSelectBase: React.FC<ProjectSelectProps> = ({
    currentProjectName,
    savedProjectsNamesAndIds,
    setCurrentProjectName,
    openProject,
    createProject,
}) => {
    const theme = useTheme();

    const anchorElementRef = useRef<HTMLDivElement | null>(null);
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    const handleProjectDropdownOpen = () => setIsProjectDropdownOpen(true);
    const handleProjectDropdownClose = () => setIsProjectDropdownOpen(false);

    const handleNewProjectDialogOpen = () => {
        setNewProjectName('');
        setIsProjectDropdownOpen(false);
        setIsNewProjectDialogOpen(true);
    };
    const handleNewProjectDialogClose = () => setIsNewProjectDialogOpen(false);
    const handleNewProjectCreateConfirm = () => {
        createProject(newProjectName);
        setIsNewProjectDialogOpen(false);
    };
    const handleNewProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewProjectName(e.target.value);
    };

    const handleEditButtonClick = (e: React.MouseEvent) => {
        setIsEditing(true);
        e.stopPropagation();
    };

    const handleEditConfirm = (e: React.MouseEvent) => {
        setIsEditing(false);
        e.stopPropagation();
    };

    const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentProjectName(e.target.value);
    };

    const handleProjectClick = (id: number) => () => {
        openProject(id);
        handleProjectDropdownClose();
    };

    const backgroundColor = theme.palette.primary.main;
    const textColor = theme.palette.primary.contrastText;

    const containerProps = {
        backgroundColor,
        color: textColor,
        ref: anchorElementRef,
        onClick: handleProjectDropdownOpen,
    };

    return (
        <>
            <ProjectSelectContainer {...containerProps}>
                {isEditing ? (
                    <ProjectSelectTextField
                        fullWidth
                        variant="standard"
                        value={currentProjectName}
                        onClick={(e) => e.stopPropagation()}
                        onChange={handleEditNameChange}
                    />
                ) : (
                    <Typography variant="h5" noWrap>
                        {currentProjectName}
                    </Typography>
                )}
                <FlexBox fullHeight center>
                    {isEditing ? (
                        <IconButton onClick={handleEditConfirm}>
                            <Check sx={{ color: theme.palette.primary.contrastText }} />
                        </IconButton>
                    ) : (
                        <IconButton onClick={handleEditButtonClick}>
                            <Edit sx={{ color: theme.palette.primary.contrastText }} />
                        </IconButton>
                    )}
                    <ProjectSelectIconWrapper isOpen={isProjectDropdownOpen}>
                        <ExpandMore />
                    </ProjectSelectIconWrapper>
                </FlexBox>
            </ProjectSelectContainer>
            <Popover
                open={isProjectDropdownOpen}
                anchorEl={anchorElementRef.current}
                onClose={handleProjectDropdownClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                marginThreshold={0}
            >
                <ProjectSelectItemsContainer>
                    {savedProjectsNamesAndIds.map(({ id, name }) => (
                        <ListItem key={id} button divider onClick={handleProjectClick(id)}>
                            <Typography>{name}</Typography>
                        </ListItem>
                    ))}
                    <ListItem
                        button
                        sx={{ justifyContent: 'space-between' }}
                        onClick={handleNewProjectDialogOpen}
                    >
                        <Typography color="primary">New project</Typography>
                        <Add color="primary" />
                    </ListItem>
                </ProjectSelectItemsContainer>
            </Popover>
            <Dialog open={isNewProjectDialogOpen} onClose={handleNewProjectDialogClose}>
                <DialogTitle>Create new project</DialogTitle>
                <DialogContent sx={{ width: '500px', maxWidth: '95%' }}>
                    <Box pt={1} width="100%">
                        <TextField
                            fullWidth
                            autoFocus
                            variant="filled"
                            label="Project name"
                            value={newProjectName}
                            onChange={handleNewProjectNameChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={handleNewProjectDialogClose}>
                        Close
                    </Button>
                    <Button variant="contained" onClick={handleNewProjectCreateConfirm}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const ProjectSelect = connectProjectSelect(ProjectSelectBase);
