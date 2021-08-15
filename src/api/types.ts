export type Category = {
  name: string
  slug: string
}

export type Frontmatter = {
  title: string
  date: string
  description: string
  cover: string
  categories: Category[]
}

export type Post = {
  content: string
  slug: string
  excerpt: string
  readTime: number
  frontmatter: Frontmatter
}

export type Field = keyof Post
export type Fields = Field[]
