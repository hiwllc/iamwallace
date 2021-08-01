// eslint-disable-next-line
const { generateRSS } = require('@uselessdev/next-rss')

generateRSS({
  description:
    'Algumas vezes faço uns desenhos e outras vezes escrevo umas coisas aqui, não apenas sobre tecnologia.',
  siteUrl: 'https://iamwallace.dev',
  title: 'Wallace Oliveira',
  destinationFolder: 'public',
  itemsFolder: 'content/posts',
  siteLanguage: 'pt_BR',
})
