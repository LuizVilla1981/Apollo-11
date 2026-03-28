import { useState } from 'react';

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  className = '',
  imageClassName = '',
  fallbackClassName = '',
  priority = false,
}: BrandLogoProps) {
  const [imageSrc, setImageSrc] = useState('/brand/logo-apollo-11.webp');
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imageSrc !== '/brand/logo-placeholder.svg') {
      setImageSrc('/brand/logo-placeholder.svg');
      return;
    }
    setHasError(true);
  };

  return (
    <div className={className}>
      {!hasError ? (
        <img
          src={imageSrc}
          alt="Apollo 11"
          width="200"
          height="56"
          className={imageClassName}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={handleError}
        />
      ) : (
        <span className={fallbackClassName}>APOLLO 11</span>
      )}
    </div>
  );
}