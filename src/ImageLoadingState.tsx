import React, { useState } from 'react';
import { ImageConfig } from './images';

interface ImageLoadingStateProps {
  image: ImageConfig;
  alt?: string;
  className?: string;
  radius?: '8px' | '0px';
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const ImageLoadingState: React.FC<ImageLoadingStateProps> = ({
  image,
  alt,
  className = '',
  radius = '8px',
  width,
  height,
  style = {},
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imgWidth = width || image.width;
  const imgHeight = height || image.height;

  if (error) {
    return (
      <div
        className={`bg-[#f4f4f4] ${className}`}
        style={{
          borderRadius: radius,
          aspectRatio: `${imgWidth} / ${imgHeight}`,
          ...style,
        }}
        aria-label={alt !== undefined ? alt : (image.alt || 'Plumbing visual placeholder')}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-[#f4f4f4] ${className}`}
      style={{
        borderRadius: radius,
        aspectRatio: `${imgWidth} / ${imgHeight}`,
        ...style,
      }}
    >
      {/* Flat placeholder base visible while loading */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-[#f4f4f4] transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Main image with transition to loaded */}
      <img
        src={image.src}
        alt={alt !== undefined ? alt : image.alt}
        width={imgWidth}
        height={imgHeight}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className="w-full h-full object-cover transition-opacity duration-300 block"
        style={{
          borderRadius: radius,
          objectPosition: image.focalPoint,
          opacity: isLoaded ? 1 : 0,
        }}
      />
    </div>
  );
};
