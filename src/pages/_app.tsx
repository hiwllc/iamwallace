import { AppProps } from 'next/app'
import Head from 'next/head'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Hello, I&apos;m Wallace</title>
        <link rel="shortcut icon" href="/images/icon-512.png" />
        <link rel="apple-touch-icon" href="/images/icon-512.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#BE9EDF" />
        <meta
          name="description"
          content="Starter with Next and Typescript with ChakraUI"
        />
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default App
