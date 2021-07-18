import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import type { Post, Fields, Field } from './types'

const POST_DIR = path.join(process.cwd(), 'content/posts')

function getAllFilesName(directory: string = POST_DIR) {
  return fs.readdirSync(directory)
}

function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const createdDate = new Date(date)
  return new Intl.DateTimeFormat('pt-BR', options).format(createdDate)
}

type TransformPostData = {
  filename: string
  fields?: Fields
  dateStyle?: Intl.DateTimeFormatOptions['dateStyle']
}

export function transformPostData({
  filename,
  fields = [],
  dateStyle,
}: TransformPostData) {
  const slug = filename.replace(/\.md$/, '')
  const absolutepath = path.join(POST_DIR, filename)
  const contents = fs.readFileSync(absolutepath, 'utf-8')
  const { data, excerpt, content } = matter(contents)

  const frontmatter = {
    ...data,
    date: formatDate(data.date, { dateStyle }),
  }

  const raw = {
    content,
    excerpt,
    frontmatter,
    slug: slug.slice(11),
  }

  if (fields.length <= 0) {
    return raw
  }

  const post = Object.fromEntries(
    Object.entries(raw).filter(([key]) => fields.includes(key as Field))
  )

  return post
}

type GetPostByPath = {
  fields: Fields
  dateStyle?: Intl.DateTimeFormatOptions['dateStyle']
}

export function getPostByFilename({ fields, dateStyle }: GetPostByPath) {
  return (filename: string) =>
    transformPostData({ filename, fields, dateStyle })
}

export async function allPosts(fields: Fields = ['frontmatter', 'slug']) {
  const paths = getAllFilesName()
  const posts = paths
    .reverse()
    .map(getPostByFilename({ fields, dateStyle: 'long' }))

  return posts as Post[]
}

export async function getPostBySlug(slug: string) {
  const paths = getAllFilesName()
  const filename = paths.find(path => path.includes(slug))

  if (!filename) {
    return null
  }

  const post = transformPostData({ filename, dateStyle: 'long' })

  return post as Post
}
