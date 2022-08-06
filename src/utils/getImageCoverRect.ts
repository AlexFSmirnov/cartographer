interface GetImageCoverRectArgs {
    imageWidth: number;
    imageHeight: number;
    containerWidth: number;
    containerHeight: number;
}

export const getImageCoverRect = ({
    imageWidth,
    imageHeight,
    containerWidth,
    containerHeight,
}: GetImageCoverRectArgs) => {
    const imageRatio = imageWidth / imageHeight;
    const containerRatio = containerWidth / containerHeight;

    const scale =
        containerRatio > imageRatio ? containerHeight / imageHeight : containerWidth / imageWidth;

    const scaledImageWidth = imageWidth * scale;
    const scaledImageHeight = imageHeight * scale;

    const scaledImageOffsetX = (containerWidth - scaledImageWidth) / 2;
    const scaledImageOffsetY = (containerHeight - scaledImageHeight) / 2;

    return {
        x: scaledImageOffsetX,
        y: scaledImageOffsetY,
        width: scaledImageWidth,
        height: scaledImageHeight,
    };
};
