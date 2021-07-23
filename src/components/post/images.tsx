import type { ReactNode } from 'react'

type Props = {
  src?: string
  alt?: string
  children: ReactNode
}

export const Image = ({ src, alt }: Props) => {
  return <img className="w-full rounded-md" alt={alt} src={src} />
}
