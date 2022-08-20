import { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Add, ExpandMore } from '@mui/icons-material';
import { ListItem, Popover, Typography } from '@mui/material';
import { getCurrentProjectName, getSavedProjectsNamesAndIds } from '../../state';
import { StoreProps } from '../../types';
import {
    ProjectSelectContainer,
    ProjectSelectIconWrapper,
    ProjectSelectItemsContainer,
} from './style';

const connectProjectSelect = connect(
    createStructuredSelector({
        currentProjectName: getCurrentProjectName,
        savedProjectsNamesAndIds: getSavedProjectsNamesAndIds,
    })
);

type ProjectSelectProps = StoreProps<typeof connectProjectSelect>;

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

export const ProjectSelect = connectProjectSelect(ProjectSelectBase);
