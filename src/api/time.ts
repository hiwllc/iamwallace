export function readTime(content: string) {
  const wps = 275 / 60
  const regex = /\w/

  let images = 0

  const words = content.split(' ').filter(word => {
    if (word.includes('<img')) {
      images += 1
    }

    return regex.test(word)
  }).length

  const imageAdjust = images * 4
  let imageSecs = 0
  let imageFactor = 12

  while (images) {
    imageSecs += imageFactor
    if (imageFactor > 3) {
      imageFactor -= 1
    }

    images -= 1
  }

  const minutes = Math.ceil(((words - imageAdjust) / wps + imageSecs) / 60)

  return minutes
}
