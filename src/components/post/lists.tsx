import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  ordered: boolean
}

export const List = ({ children, ordered }: Props) => {
  if (ordered) {
    return <ol className="list-outside">{children}</ol>
  }

  return <ul className="list-outside list-disc">{children}</ul>
}

export const Li = ({ children }: Omit<Props, 'ordered'>) => {
  return <li className="text-lg leading-8 text-gray-600">{children}</li>
}
