import { ReactNode } from 'react'
import { Header } from './header'
import { Footer } from './footer'

const AVATAR_SIZE = 48

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return (
    <>
      <Header size={AVATAR_SIZE} />
      <main className="w-full flex-1 px-4 py-8">{children}</main>
      <Footer />
    </>
  )
}
