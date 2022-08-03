import { IconButton, SvgIconTypeMap, Tooltip } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface BottomMenuButtonProps {
    Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const BottomMenuButton: React.FC<BottomMenuButtonProps> = ({ Icon, label, active, onClick }) => {
    return (
        <Tooltip title={label}>
            <IconButton color={active ? 'primary' : 'default'} onClick={onClick}>
                <Icon />
            </IconButton>
        </Tooltip>
    );
};

export default BottomMenuButton;
