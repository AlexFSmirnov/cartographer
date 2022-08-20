import { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { getCurrentProjectAllRegions } from '../../../state';
import { Region, StoreProps } from '../../../types';
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
            <Box width="100%" textAlign="center" pt={5}>
                <Typography>The region is not referenced by any other regions.</Typography>
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" height="100%" overflow="auto">
            {referencedBy.map((r) => (
                <ReferenceCard key={r.id} region={r} referencedId={region.id} />
            ))}
        </Box>
    );
};

export const ReferencesPage = connectReferencesPage(ReferencesPageBase);
