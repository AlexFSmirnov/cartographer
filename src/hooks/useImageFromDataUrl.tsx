import { useMemo, useState } from 'react';

export const useImageFromDataUrl = (dataUrl: string | null) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const loadingImage = useMemo(() => {
        setIsLoaded(false);

        if (!dataUrl) {
            return null;
        }

        const image = new Image();
        image.src = dataUrl;

        image.onload = () => setIsLoaded(true);

        return image;
    }, [dataUrl]);

    return isLoaded ? loadingImage : null;
};
