import { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getCurrentProjectAllRegions } from '../../../state';
import { StoreProps } from '../../../types';

const connectReferencesPage = connect(
    createStructuredSelector({
        allRegions: getCurrentProjectAllRegions,
    })
);

interface ReferencesPageProps extends StoreProps<typeof connectReferencesPage> {
    regionId: string;
    description: string;
}

const ReferencesPageBase: React.FC<ReferencesPageProps> = ({
    regionId,
    description,
    allRegions,
}) => {
    const references = useMemo(() => {
        const matches = description.matchAll(/\[(.+?)\]/g);
        const regionIds = Array.from(matches).map((match) => match[1]);

        return regionIds.filter((id) => allRegions.find((region) => region.id === id));
    }, [description, allRegions]);

    const referencedBy = useMemo(() => {
        const referencedRegions = Object.values(allRegions).filter((region) => {
            return region.description.includes(`${regionId}`);
        });

        return referencedRegions.map((region) => region.id);
    }, [regionId, allRegions]);

    return (
        <>
            <p>{references.join(' ')}</p>
            <p>---</p>
            <p>{referencedBy.join(' ')}</p>
        </>
    );
};

export const ReferencesPage = connectReferencesPage(ReferencesPageBase);
