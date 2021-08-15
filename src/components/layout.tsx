import { ReactNode, useEffect } from 'react'
import { Header } from './header'
import { Footer } from './footer'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  useEffect(() => {
    fetch('api/categories')
      .then(res => res.json())
      .then(console.log)
  }, [])

  return (
    <>
      <Header />
      <main className="w-full flex-1 px-4 py-8">{children}</main>
      <Footer />
    </>
  )
}
