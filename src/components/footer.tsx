import {
  TiSocialTwitter,
  TiSocialGithub,
  TiSocialLinkedin,
  TiRss,
} from 'react-icons/ti'

const SOCIAL = [
  {
    name: 'Twitter',
    label: 'Este é o link pro meu twitter',
    icon: <TiSocialTwitter />,
    url: 'https://twitter.com/uselessdevelop',
  },
  {
    name: 'Github',
    label: 'Este é o link pro meu Github',
    icon: <TiSocialGithub />,
    url: 'https://github.com/uselessdev',
  },
  {
    name: 'LinkedIn',
    label: 'Este é o link pro meu linkedin',
    icon: <TiSocialLinkedin />,
    url: 'https://linkedin.com/in/wallacebatistaoliveira',
  },
  {
    name: 'RSS',
    label: 'Este é o link pro feed (RSS) do blog',
    icon: <TiRss />,
    url: 'https://iamwallace.dev/rss.xml',
  },
]

export const Footer = () => {
  return (
    <footer className="px-4 py-6 w-full">
      <nav className="max-w-2xl m-auto flex space-x-4">
        {SOCIAL.map(social => (
          <a
            className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded-full text-xl text-pink-400 hover:bg-pink-400 hover:text-white transition-colors"
            key={social.name}
            href={social.url}
            aria-label={social.label}
          >
            {social.icon}
          </a>
        ))}
      </nav>
    </footer>
  )
}
