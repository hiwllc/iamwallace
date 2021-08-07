import { NextApiRequest, NextApiResponse } from 'next'
import chromium from 'chrome-aws-lambda'

const siteUrl = (path: string) => {
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:8888/${path}`
  }

  return `https://iamwallace.dev/${path}`
}

export default async function (
  request: NextApiRequest,
  response: NextApiResponse
) {
  const {
    query: { slug },
  } = request

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: { height: 795, width: 1024 },
    headless: chromium.headless,
  })

  const page = await browser.newPage()
  await page.goto(siteUrl(`og/${slug}`))
  const screenshot = await page.screenshot()
  await browser.close()

  response.setHeader('Content-Type', 'image/png')

  if (process.env.NODE_ENV !== 'development') {
    response.setHeader(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    )
  }

  response.send(screenshot)
}
