import { useEffect, useState } from 'react';
import { useImagesContext } from '../images';

export const useImageFromContext = (imageId: string | null) => {
    const { getImageDataUrl } = useImagesContext();

    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        setImage(null);
        if (!imageId) {
            return;
        }

        getImageDataUrl(imageId).then((dataUrl) => {
            if (!dataUrl) {
                return null;
            }

            const image = new Image();
            image.src = dataUrl;

            image.onload = () => setImage(image);
        });
    }, [imageId, getImageDataUrl]);

    return image;
};
