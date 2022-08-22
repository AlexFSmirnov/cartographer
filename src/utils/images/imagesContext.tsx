import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import localforage from 'localforage';

interface ImagesContextMethods {
    setProjectId: (projectId: string | null) => void;
    getImageDataUrl: (imageId: string) => Promise<string | null>;
    setImageDataUrl: (imageId: string, dataUrl: string) => Promise<string | null>;
    updateImageId: (props: { oldId: string; newId: string }) => Promise<void>;
    deleteImage: (imageId: string) => Promise<void>;
}

const imageContextDefaultMethods: ImagesContextMethods = {
    setProjectId: () => {},
    getImageDataUrl: async () => null,
    setImageDataUrl: async () => null,
    updateImageId: async () => {},
    deleteImage: async () => {},
};

const ImagesContext = createContext(imageContextDefaultMethods);

// TODO: Prefix images with project id

const getImageKey = ({ imageId, projectId }: { imageId: string; projectId: string }) =>
    `${projectId}-${imageId}`;

export const ImagesContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projectId, setProjectIdState] = useState<string>('');
    const [rerender, setRerender] = useState(false);

    const getImageDataUrl = useCallback(
        async (imageId: string) =>
            localforage.getItem<string | null>(getImageKey({ imageId, projectId })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rerender, projectId]
    );
    const setImageDataUrl = useCallback(
        async (imageId: string, dataUrl: string) => {
            await localforage.setItem(getImageKey({ imageId, projectId }), dataUrl);
            setRerender(!rerender);

            return dataUrl;
        },
        [rerender, projectId]
    );

    const deleteImage = useCallback(
        async (imageId: string) => {
            await localforage.removeItem(getImageKey({ imageId, projectId }));
            setRerender(!rerender);
        },
        [rerender, projectId]
    );

    const updateImageId = useCallback(
        async ({ oldId, newId }: { oldId: string; newId: string }) => {
            const dataUrl = await getImageDataUrl(getImageKey({ imageId: oldId, projectId }));

            if (dataUrl) {
                await setImageDataUrl(getImageKey({ imageId: newId, projectId }), dataUrl);
            }

            await deleteImage(oldId);
        },
        [deleteImage, getImageDataUrl, setImageDataUrl, projectId]
    );

    const setProjectId = useCallback(
        (projectId: string | null) => {
            setProjectIdState(projectId || '');
        },
        [setProjectIdState]
    );

    const methods = useMemo(
        () => ({ getImageDataUrl, setImageDataUrl, deleteImage, updateImageId, setProjectId }),
        [getImageDataUrl, setImageDataUrl, deleteImage, updateImageId, setProjectId]
    );

    return <ImagesContext.Provider value={methods}>{children}</ImagesContext.Provider>;
};

export const useImagesContext = () => {
    const methods = useContext(ImagesContext);
    return methods;
};
