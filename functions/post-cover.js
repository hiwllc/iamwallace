/* eslint-disable @typescript-eslint/no-var-requires */
const chromium = require('chrome-aws-lambda')

const siteUrl = path => {
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:8888/${path}`
  }

  return `https:/iamwallace.dev/${path}`
}

exports.handler = async (event, context) => {
  const slug = event.queryStringParameters.slug

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: { height: 620, width: 1200 },
    headless: chromium.headless,
  })

  console.log(siteUrl(`og/${slug}`), process.env.NODE_ENV)

  const page = await browser.newPage()
  await page.goto(siteUrl(`og/${slug}`))
  const screenshot = await page.screenshot({ type: 'png' })
  await browser.close()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/png',
    },
    multiValueHeaders: {
      'Cache-Control': [
        'public',
        'immutable',
        'no-transform',
        's-maxage=31536000',
        'max-age=31536000',
      ],
    },
    body: screenshot.toString('base64'),
    isBase64Encoded: true,
  }
}