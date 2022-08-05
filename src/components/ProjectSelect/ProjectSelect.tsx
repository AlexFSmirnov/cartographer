import { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ListItem, Popover, Typography } from '@mui/material';
import { Add, ExpandMore } from '@mui/icons-material';
import { getCurrentProjectName, getSavedProjectsNamesAndIds } from '../../state';
import {
    ProjectSelectContainer,
    ProjectSelectIconWrapper,
    ProjectSelectItemsContainer,
} from './style';

interface StateProps {
    currentProjectName: string | null;
    savedProjectsNamesAndIds: Array<{ id: string; name: string }>;
}

type ProjectSelectProps = StateProps;

const ProjectSelectBase: React.FC<ProjectSelectProps> = ({
    currentProjectName,
    savedProjectsNamesAndIds,
}) => {
    const anchorElementRef = useRef<HTMLButtonElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const title = currentProjectName || 'Untitled project';

    return (
        <>
            <ProjectSelectContainer variant="contained" ref={anchorElementRef} onClick={handleOpen}>
                <Typography variant="h5">{title}</Typography>
                <ProjectSelectIconWrapper isOpen={isOpen}>
                    <ExpandMore />
                </ProjectSelectIconWrapper>
            </ProjectSelectContainer>
            <Popover
                open={isOpen}
                anchorEl={anchorElementRef.current}
                onClose={handleClose}
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
                        <ListItem key={id} button divider>
                            <Typography>{name}</Typography>
                        </ListItem>
                    ))}
                    <ListItem button sx={{ justifyContent: 'space-between' }}>
                        <Typography color="primary">New project</Typography>
                        <Add color="primary" />
                    </ListItem>
                </ProjectSelectItemsContainer>
            </Popover>
        </>
    );
};

export const ProjectSelect = connect(
    createStructuredSelector({
        currentProjectName: getCurrentProjectName,
        savedProjectsNamesAndIds: getSavedProjectsNamesAndIds,
    })
)(ProjectSelectBase);
