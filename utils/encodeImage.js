import { Image, createCanvas } from 'canvas'
import { encode } from 'blurhash'

const loadImage = async (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (...args) => reject(args)
    img.src = src
  })

const getImageData = (image) => {
  const canvas = createCanvas(image.width, image.height)
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)
  return context.getImageData(0, 0, image.width, image.height)
}

export const encodeImage = async (url) => {
  const image = await loadImage(url)
  const imageData = getImageData(image)
  return encode(imageData.data, imageData.width, imageData.height, 4, 4)
}
