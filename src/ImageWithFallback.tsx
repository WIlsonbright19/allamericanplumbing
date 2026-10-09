import React, { useState } from 'react';
import { ImageConfig } from './images';

interface ImageWithFallbackProps {
  image: ImageConfig;
  alt?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  radius?: string;
  style?: React.CSSProperties;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  image,
  alt,
  className = '',
  loading = 'eager',
  radius = '8px',
  style = {},
}) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-[#f4f4f4] ${className}`}
        style={{
          borderRadius: radius,
          aspectRatio: `${image.width} / ${image.height}`,
          ...style,
        }}
        aria-label={alt !== undefined ? alt : (image.alt || 'Plumbing visual placeholder')}
      />
    );
  }

  return (
    <img
      src={image.src}
      alt={alt !== undefined ? alt : image.alt}
      width={image.width}
      height={image.height}
      loading={loading}
      decoding="async"
      onError={() => setError(true)}
      className={className}
      style={{
        borderRadius: radius,
        objectPosition: image.focalPoint,
        ...style,
      }}
    />
  );
};
