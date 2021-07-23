import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const H3 = ({ children }: Props) => (
  <h2 className="text-xl text-gray-500 font-black mt-10 mb-4">{children}</h2>
)
