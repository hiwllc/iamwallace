import Head from 'next/head'

type Props = {
  title?: string
  description?: string
  image?: string
}

export function SEO({ description, title, image }: Props) {
  const siteTitle = 'Wallace Oliveira'
  const ogImage = `https://iamwallace.dev/${image || 'images/me.jpg'}`

  return (
    <Head>
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:image" content={ogImage} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image:src" content={ogImage} />
      <meta property="twitter:creator" content="@uselessdevelop" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Head>
  )
}
