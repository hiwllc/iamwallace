import { ReactNode } from 'react'

export type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return <div className="min-h-screen bg-gray-100">{children}</div>
}
