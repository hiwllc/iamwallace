import { ReactNode } from 'react'
import NextImage from 'next/image'

type Props = {
  src?: string
  alt?: string
  children: ReactNode
}

const getImageURL = (path: string) => {
  const baseURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/'
      : 'https://iamwallace.dev/'

  return `${baseURL}${path}`
}

export const Image = ({ src, alt }: Props) => {
  const isLocalImage = src?.startsWith('images')

  if (isLocalImage && src) {
    return (
      <picture className="relative w-full block aspect-w-16 aspect-h-9">
        <NextImage
          placeholder="blur"
          layout="fill"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNsrQcAAY8BBhuFt1sAAAAASUVORK5CYII="
          src={getImageURL(src)}
          alt={alt}
          objectFit="contain"
          objectPosition="center"
          className="rounded-md"
        />
      </picture>
    )
  }

  return (
    <img className="w-full rounded-md" alt={alt} src={src} loading="lazy" />
  )
}
