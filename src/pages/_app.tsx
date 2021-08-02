import { AppProps } from 'next/app'
import Head from 'next/head'
import { Layout } from 'components/layout'
import '../styles.css'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Oi, Eu sou o Wallace</title>
        <link rel="shortcut icon" href="/images/icon-512.png" />
        <link rel="apple-touch-icon" href="/images/icon-512.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#BE9EDF" />
        <meta
          name="description"
          content="Algumas vezes faço uns desenhos e outras vezes escrevo umas coisas aqui, não apenas sobre tecnologia."
        />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default App
