import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { getCurrentProjectAllRegions } from '../../../state';
import { Region, StoreProps } from '../../../types';
import { FlexBox } from '../../FlexBox';
import { ReferenceCard } from './ReferenceCard';

const connectReferencesPage = connect(
    createStructuredSelector({
        allRegions: getCurrentProjectAllRegions,
    })
);

interface ReferencesPageProps extends StoreProps<typeof connectReferencesPage> {
    region: Region;
}

const ReferencesPageBase: React.FC<ReferencesPageProps> = ({ region, allRegions }) => {
    const referencedBy = useMemo(
        () => Object.values(allRegions).filter((r) => r.description.includes(`[${region.id}]`)),
        [region, allRegions]
    );

    if (referencedBy.length === 0) {
        return (
            <FlexBox pt={5} center>
                <Typography>The region is not referenced by any other regions.</Typography>
            </FlexBox>
        );
    }

    return (
        <Box overflow="auto" mt={1}>
            {referencedBy.map((r) => (
                <ReferenceCard key={r.id} region={r} referencedId={region.id} />
            ))}
        </Box>
    );
};

export const ReferencesPage = connectReferencesPage(ReferencesPageBase);
