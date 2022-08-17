import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import localforage from 'localforage';

interface ImagesContextMethods {
    getImageDataUrl: (imageId: string) => Promise<string | null>;
    setImageDataUrl: (imageId: string, dataUrl: string) => Promise<string | null>;
    updateImageId: (props: { oldId: string; newId: string }) => Promise<void>;
    deleteImage: (imageId: string) => Promise<void>;
}

const imageContextDefaultMethods: ImagesContextMethods = {
    getImageDataUrl: async () => null,
    setImageDataUrl: async () => null,
    updateImageId: async () => {},
    deleteImage: async () => {},
};

const ImagesContext = createContext(imageContextDefaultMethods);

export const ImagesContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rerender, setRerender] = useState(false);

    const getImageDataUrl = useCallback(
        async (imageId: string) => localforage.getItem<string | null>(imageId),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rerender]
    );
    const setImageDataUrl = useCallback(
        async (imageId: string, dataUrl: string) => {
            await localforage.setItem(imageId, dataUrl);
            setRerender(!rerender);

            return dataUrl;
        },
        [rerender]
    );

    const deleteImage = useCallback(
        async (imageId: string) => {
            await localforage.removeItem(imageId);
            setRerender(!rerender);
        },
        [rerender]
    );

    const updateImageId = useCallback(
        async ({ oldId, newId }: { oldId: string; newId: string }) => {
            const dataUrl = await getImageDataUrl(oldId);

            if (dataUrl) {
                await setImageDataUrl(newId, dataUrl);
            }

            await deleteImage(oldId);
        },
        [deleteImage, getImageDataUrl, setImageDataUrl]
    );

    const methods = useMemo(
        () => ({ getImageDataUrl, setImageDataUrl, deleteImage, updateImageId }),
        [getImageDataUrl, setImageDataUrl, deleteImage, updateImageId]
    );

    return <ImagesContext.Provider value={methods}>{children}</ImagesContext.Provider>;
};

export const useImagesContext = () => {
    const methods = useContext(ImagesContext);
    return methods;
};
