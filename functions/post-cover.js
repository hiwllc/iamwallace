/* eslint-disable @typescript-eslint/no-var-requires */
const chromium = require('chrome-aws-lambda')

exports.handler = async (event, context) => {
  const slug = event.queryStringParameters.slug
  const pageTarget = `https://iamwallace.dev/og/${slug}`

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: { height: 795, width: 1024 },
    headless: chromium.headless,
  })

  const page = await browser.newPage()

  await page.goto(pageTarget)

  const screenshot = await page.screenshot()

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
