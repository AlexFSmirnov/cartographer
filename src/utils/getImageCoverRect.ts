interface GetImageCoverRectArgs {
    imageWidth: number;
    imageHeight: number;
    containerWidth: number;
    containerHeight: number;
    padding: number;
}

export const getImageCoverRect = ({
    imageWidth,
    imageHeight,
    containerWidth,
    containerHeight,
    padding,
}: GetImageCoverRectArgs) => {
    const paddedContainerWidth = containerWidth - padding * 2;
    const paddedContainerHeight = containerHeight - padding * 2;

    const imageRatio = imageWidth / imageHeight;
    const containerRatio = paddedContainerWidth / paddedContainerHeight;

    const scale =
        containerRatio > imageRatio
            ? paddedContainerHeight / imageHeight
            : paddedContainerWidth / imageWidth;

    const scaledImageWidth = imageWidth * scale;
    const scaledImageHeight = imageHeight * scale;

    const scaledImageOffsetX = (paddedContainerWidth - scaledImageWidth) / 2;
    const scaledImageOffsetY = (paddedContainerHeight - scaledImageHeight) / 2;

    const x = containerRatio > imageRatio ? scaledImageOffsetX : scaledImageOffsetX + padding;
    const y = containerRatio > imageRatio ? scaledImageOffsetY + padding : scaledImageOffsetY;

    return {
        x,
        y,
        width: scaledImageWidth,
        height: scaledImageHeight,
    };
};
