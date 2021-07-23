import type { ReactNode } from 'react'
import slugify from 'slugify'

type Props = {
  children: ReactNode
}

/**
 * @TODO slugify text to generate headers
 */
export const H2 = ({ children }: Props) => {
  const slug = slugify(String(children), { lower: true })

  return (
    <h2
      id={slug}
      className="group text-3xl text-gray-700 font-black mt-12 mb-6 relative"
    >
      <a
        className="absolute text-pink-500 transform right-full mr-2 opacity-0 transition-opacity group-hover:opacity-50"
        href={`#${slug}`}
      >
        #
      </a>{' '}
      {children}
    </h2>
  )
}
