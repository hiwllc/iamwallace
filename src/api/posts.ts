import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

type Post = {
  frontmatter: {
    [key: string]: any
  }
  slug: string
}

const postsDir = join(process.cwd(), 'content/posts')

export function getAllFileNamesFrom(directory: string) {
  return fs.readdirSync(directory)
}

export function getPostByPath(path: string): Post {
  const slug = path.replace(/\.md$/, '')
  const absolutePath = join(postsDir, path)
  const contents = fs.readFileSync(absolutePath, 'utf-8')

  const posts = matter(contents)

  // @TODO need to create a function to read post
  // console.log(posts.content)

  return {
    frontmatter: posts.data,
    slug,
  }
}

function dateToString(post: Post) {
  return {
    ...post,
    frontmatter: {
      ...post.frontmatter,
      date: post.frontmatter.date.toLocaleString(),
    },
  }
}

export function getAllPosts() {
  const paths = getAllFileNamesFrom(postsDir)
  const posts = paths.map(getPostByPath).map(dateToString)

  return posts
}
