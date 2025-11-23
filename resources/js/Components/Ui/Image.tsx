import { filePath, handleImageError } from "@/Utils/helpers";
import React from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt: string;
    baseUrl?: string;
    fallback?: string;
    lazy?: boolean;
}

const Image: React.FC<ImageProps> = ({
    src,
    alt,
    baseUrl = "",
    fallback,
    lazy = true,
    className = "",
    onError,
    ...props
}) => {
    const fullSrc = filePath(src, baseUrl);

    const handleError = (
        event: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
        if (onError) {
            onError(event);
        } else {
            handleImageError(event, fallback);
        }
    };

    return (
        <img
            src={fullSrc}
            alt={alt}
            loading={lazy ? "lazy" : "eager"}
            className={className}
            onError={handleError}
            {...props}
        />
    );
};

export default Image;
