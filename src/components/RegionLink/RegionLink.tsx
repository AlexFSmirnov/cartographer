import { Link } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { URL_BASENAME } from '../../constants';
import { parseUrl } from '../../utils';

interface RegionLinkProps {
    relativeHref?: string;
    isClickable?: boolean;
    children: React.ReactNode;
}

export const RegionLink: React.FC<RegionLinkProps> = ({ relativeHref, isClickable, children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { view } = parseUrl(location.pathname);

    const handleClick = (e: React.MouseEvent) => {
        if (isClickable) {
            navigate(`/${view}${relativeHref || ''}`);
        }

        e.preventDefault();
    };

    const href = `${window.location.origin}${URL_BASENAME}/${view}${relativeHref || ''}`;

    return (
        <Link href={href} onClick={handleClick}>
            {children}
        </Link>
    );
};
