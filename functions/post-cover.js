const fs = require('fs')
const chromium = require('chrome-aws-lambda')

exports.handler = async (event, context) => {
  // const params = JSON.parse(event.body)
  // const pageTarget = params.page
  const pageTarget = 'https://iamwallace.dev/unity-arch-e-vscode'

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
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
      'Cache-Control': ['public', 'immutable', 'no-transform'],
    },
    body: screenshot.toString('base64'),
    isBase64Encoded: true,
  }
}
