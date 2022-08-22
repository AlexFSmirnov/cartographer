import { Tooltip, Typography } from '@mui/material';
import { useUrlNavigation } from '../../utils';
import { RegionPreviewTooltip } from '../RegionPreviewTooltip';

interface BreadcrumbProps {
    id: string;
    name: string;
    type: 'map' | 'region';
    parentMapId?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ id, name, type, parentMapId }) => {
    const { getHref, setUrlParts } = useUrlNavigation();

    const handleClick = (e: React.MouseEvent) => {
        if (type === 'map') {
            setUrlParts({ activeMapId: id, regionId: null });
        } else if (parentMapId) {
            setUrlParts({ activeMapId: parentMapId, regionId: id });
        }

        e.preventDefault();
    };

    const href =
        type === 'region' && parentMapId
            ? getHref({ activeMapId: parentMapId, regionId: id })
            : getHref({ activeMapId: id, regionId: null });

    let tooltipElement: React.ReactNode = '';
    if (type === 'map') {
        tooltipElement = <RegionPreviewTooltip mapId={id} name={name} />;
    } else if (parentMapId) {
        tooltipElement = <RegionPreviewTooltip mapId={parentMapId} regionId={id} name={name} />;
    }

    return (
        <a href={href} style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleClick}>
            <Tooltip title={tooltipElement}>
                <Typography variant="h5" sx={{ fontWeight: 300, opacity: 0.7 }}>
                    {id}
                </Typography>
            </Tooltip>
        </a>
    );
};
