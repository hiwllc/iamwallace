import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class NextDocument extends Document {
  render() {
    return (
      <Html lang="pt_BR">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
