import { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Tab, Tooltip } from '@mui/material';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import { FlexBox, RegionPreviewTooltip } from '../../../components';
import { getCurrentProjectMaps } from '../../../state';
import { Map, StoreProps } from '../../../types';
import { getSiblingMaps, useUrlNavigation } from '../../../utils';

const connectSiblingMapSelect = connect(
    createStructuredSelector({
        maps: getCurrentProjectMaps,
    })
);

type SiblingMapSelectProps = StoreProps<typeof connectSiblingMapSelect>;

const TAB_HEIGHT = 32;

const VerticalTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#2e2e2e' : theme.palette.grey[100],
    borderRadius: 16,
    marginRight: 8,
    boxShadow: theme.shadows[2],
    '& .MuiButtonBase-root': {
        height: TAB_HEIGHT,
        minHeight: TAB_HEIGHT,
        minWidth: 0,
        borderRadius: 16,
        padding: 12,
        zIndex: 1,
    },
    '& .MuiTabs-indicator': {
        height: TAB_HEIGHT,
        width: '100%',
        borderRadius: 16,
        zIndex: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
    },
}));

const SiblingMapSelectBase: React.FC<SiblingMapSelectProps> = ({ maps }) => {
    const { getUrlParts, setUrlParts } = useUrlNavigation();
    const { activeMapId } = getUrlParts();

    const siblingMaps = useMemo(() => {
        if (!activeMapId) {
            return [];
        }

        const map = maps[activeMapId];
        return [map, ...getSiblingMaps({ map: maps[activeMapId], maps })].sort((a, b) =>
            a.id < b.id ? -1 : 1
        );
    }, [activeMapId, maps]);

    const activeMapIndex = useMemo(
        () => siblingMaps.findIndex((map) => map.id === activeMapId),
        [activeMapId, siblingMaps]
    );

    const handleTabClick = (mapId: string) => () => {
        setUrlParts({ activeMapId: mapId, regionId: null });
    };

    if (siblingMaps.length === 0) {
        return null;
    }

    return (
        <FlexBox
            alignX="flex-end"
            alignY="center"
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
            }}
        >
            <VerticalTabs
                orientation="vertical"
                value={activeMapIndex}
                sx={{ pointerEvents: 'all' }}
            >
                {siblingMaps.map(({ id, name }) => (
                    <Tooltip
                        key={id}
                        placement="left"
                        title={<RegionPreviewTooltip mapId={id} name={name} />}
                    >
                        <Tab label={id} onClick={handleTabClick(id)} />
                    </Tooltip>
                ))}
            </VerticalTabs>
        </FlexBox>
    );
};

export const SiblingMapSelect = connectSiblingMapSelect(SiblingMapSelectBase);
