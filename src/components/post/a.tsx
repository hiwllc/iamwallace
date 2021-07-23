import type { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  href?: string
  children: ReactNode
}

const INTERNAL_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://iamwallace.netlify.app/'
    : 'http://localhost:3000/'

export const A = ({ href, children }: Props) => {
  const internal = href?.startsWith(INTERNAL_URL)

  if (internal) {
    return (
      <Link href={INTERNAL_URL}>
        <a>{children}</a>
      </Link>
    )
  }

  /**
   * @TODO add external link
   */
  return (
    <a href={href} className="text-pink-500 font-semibold">
      {children}
    </a>
  )
}
