import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FlexBox } from '../../components';
import { getCurrentProjectRootMaps } from '../../state';
import { StoreProps } from '../../types';
import { RegionAccordion } from './components';

const connectRegionsView = connect(
    createStructuredSelector({
        rootMaps: getCurrentProjectRootMaps,
    })
);

type RegionsViewProps = StoreProps<typeof connectRegionsView>;

const RegionsViewBase: React.FC<RegionsViewProps> = ({ rootMaps }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (rootMaps.length === 0) {
        return (
            <FlexBox fullWidth center pt={2}>
                <Typography variant="h5">This project has no regions.</Typography>
            </FlexBox>
        );
    }

    return (
        <FlexBox fullWidth fullHeight alignX="center" overflow="auto">
            <FlexBox column fullWidth maxHeight="100%" maxWidth={isMobile ? '100%' : '800px'}>
                {rootMaps.map(({ id }) => (
                    <RegionAccordion root expanded={rootMaps.length === 1} key={id} mapId={id} />
                ))}
                <Box minHeight={100} />
            </FlexBox>
        </FlexBox>
    );
};

export const RegionsView = connectRegionsView(RegionsViewBase);
