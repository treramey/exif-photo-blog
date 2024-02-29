'use client';

/* eslint-disable jsx-a11y/alt-text */
import { BLUR_ENABLED } from '@/site/config';
import { clsx}  from 'clsx/lite';
import Image, { ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function ImageBlurFallback(props: ImageProps) {
  const {
    className,
    priority,
    blurDataURL,
    ...rest
  } = props;

  const [wasCached, setWasCached] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [didError, setDidError] = useState(false);

  const [hideBlurPlaceholder, setHideBlurPlaceholder] = useState(false);

  const imageClassName = 'object-cover h-full';

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const timeout = setTimeout(
      () => setWasCached(imgRef.current?.complete ?? false),
      100,
    );
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isLoading && !didError) {
      const timeout = setTimeout(() => {
        setHideBlurPlaceholder(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, didError]);

  const showPlaceholder =
    !wasCached &&
    !hideBlurPlaceholder;

  return (
    <div
      className={clsx(
        className,
        'flex relative',
      )}
    >
      {showPlaceholder &&
        <div className={clsx(
          'absolute inset-0',
          'bg-main overflow-hidden',
          'transition-opacity duration-300 ease-in',
          isLoading ? 'opacity-100' : 'opacity-0',
        )}>
          {(BLUR_ENABLED && props.blurDataURL)
            ? <img {...{
              ...rest,
              src: blurDataURL,
              className: clsx(
                imageClassName,
                // Fix poorly blurred placeholder data generated by Safari
                'blur-md scale-105',
              ),
            }} />
            :  <div className={clsx(
              'w-full h-full',
              'bg-gray-100/50 dark:bg-gray-900/50',
            )}/>}
        </div>}
      <Image {...{
        ...rest,
        ref: imgRef,
        priority,
        className: imageClassName,
        onLoad: () => setIsLoading(false),
        onError: () => setDidError(true),
      }} />
    </div>
  );
}
