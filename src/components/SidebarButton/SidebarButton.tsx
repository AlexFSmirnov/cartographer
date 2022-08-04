import { ListItem, Switch } from '@mui/material';

interface BaseProps {
    children: React.ReactNode;
    onClick: () => void;
    divider?: boolean;

    icon?: React.ReactNode;
    toggle?: boolean;
    isActive?: boolean;
}

interface PropsWithIcon extends BaseProps {
    icon: React.ReactNode;
}

interface PropsWithToggle extends BaseProps {
    toggle: true;
}

type SidebarButtonProps = PropsWithIcon | PropsWithToggle;

export const SidebarButton: React.FC<SidebarButtonProps> = ({
    children,
    onClick,
    divider,
    icon,
    toggle,
    isActive,
}) => (
    <ListItem
        button
        divider={divider}
        onClick={onClick}
        sx={{ height: '48px', justifyContent: 'space-between' }}
    >
        {children}
        {icon}
        {toggle === true && <Switch checked={isActive} />}
    </ListItem>
);
