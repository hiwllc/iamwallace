import { ReactNode } from 'react'

export type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return <div>{children}</div>
}
