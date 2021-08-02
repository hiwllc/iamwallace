import * as fs from 'fs'
import * as path from 'path'

export const POST_DIR = path.join(process.cwd(), 'content/posts')

export function getAllFilenames(directory: string = POST_DIR) {
  return fs.readdirSync(directory)
}

export function getFileContents(filename: string) {
  return fs.readFileSync(path.join(POST_DIR, filename), 'utf-8')
}
