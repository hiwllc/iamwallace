export type Frontmatter = {
  title: string
  date: string
  description: string
  cover: string
  categories: string[]
}

export type Post = {
  content: string
  slug: string
  excerpt: string
  frontmatter: Frontmatter
}

export type Field = keyof Post
export type Fields = Field[]
