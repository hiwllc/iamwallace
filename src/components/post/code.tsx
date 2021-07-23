import type { ReactNode } from 'react'
import Hightlight, { defaultProps, Language } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/dracula'

type Props = {
  children: ReactNode
  className?: string
  inline?: boolean
}

export const Code = ({ children, className, inline }: Props) => {
  const language = className ? className.split('-').pop() : ''

  if (inline) {
    return (
      <code className="py-1 pt-2 px-3 bg-pink-500 bg-opacity-75 text-white rounded-lg font-semibold select-none">
        {children}
      </code>
    )
  }

  return (
    <Hightlight
      {...defaultProps}
      theme={theme}
      code={String(children).replace(/\n$/, '')}
      language={language as Language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        return (
          <div
            className={`rounded-md scrollbar scrollbar-thumb-pink-400 scrollbar-track-pink-100 overflow-x-auto ${className}`}
            style={style}
          >
            <div className="p-6 min-w-max">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )
      }}
    </Hightlight>
  )
}
