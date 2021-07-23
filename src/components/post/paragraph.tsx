import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const Paragraph = ({ children }: Props) => (
  <p className="text-lg my-6 leading-8">{children}</p>
)
