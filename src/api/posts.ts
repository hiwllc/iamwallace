import matter from 'gray-matter'
import slugify from 'slugify'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import type { Post, Fields, Field, Category } from './types'
import { getAllFilenames, getFileContents } from './files'
import { readTime } from './time'

dayjs.locale('pt-br')

function formatDate(date: Date | string) {
  return dayjs(date).format('DD [de] MMMM, YYYY')
}

function formatCategories(categories: string[]) {
  return categories.map(category => ({
    name: category,
    slug: slugify(category, { lower: true }),
  }))
}

type MarkdownToPostData = {
  filename: string
  fields?: Fields
}

function markdownPostData({ filename, fields = [] }: MarkdownToPostData) {
  const slug = filename.slice(11).replace(/\.md$/, '')
  const fileraw = getFileContents(filename)
  const { data, excerpt, content } = matter(fileraw)

  const frontmatter = {
    ...data,
    categories: formatCategories(data.categories),
    date: formatDate(data.date),
  }

  const raw = {
    content,
    excerpt,
    frontmatter,
    slug,
    readTime: readTime(content),
  }

  if (fields.length <= 0) {
    return raw
  }

  const post = Object.fromEntries(
    Object.entries(raw).filter(([key]) => fields.includes(key as Field))
  )

  return post
}

function getPostByFilename(fields: Fields) {
  return (filename: string) => markdownPostData({ filename, fields })
}

export async function allPosts(fields: Fields = ['frontmatter', 'slug']) {
  return getAllFilenames().reverse().map(getPostByFilename(fields)) as Post[]
}

export async function allCategories() {
  const posts = getAllFilenames().map(
    getPostByFilename(['frontmatter'])
  ) as Pick<Post, 'frontmatter'>[]

  const postsCategories = posts.map(post => post.frontmatter.categories)

  return [...new Set(postsCategories)].flat(Infinity) as Category[]
}

export async function post(slug: string) {
  const paths = getAllFilenames()
  const filename = paths.find(path => path.includes(slug))

  if (!filename) {
    return null
  }

  const post = markdownPostData({ filename })

  return post as Post
}

export async function postsByCategory(category: string) {
  const results = await allPosts()

  const posts = results.filter(({ frontmatter }) => {
    return frontmatter.categories.some(({ slug }) => slug === category)
  })

  return posts
}
