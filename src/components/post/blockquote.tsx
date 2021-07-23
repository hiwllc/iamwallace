import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const Blockquote = ({ children }: Props) => {
  return (
    <blockquote className="px-8 py-2 bg-pink-50 rounded-md text-gray-700 border-l-4 border-pink-400">
      {children}
    </blockquote>
  )
}
