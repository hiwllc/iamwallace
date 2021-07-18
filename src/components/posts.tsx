import Link from 'next/link'
import type { Post } from 'api'

type Props = {
  posts: Post[]
}

export function Posts({ posts }: Props) {
  return (
    <section className="w-full space-y-12 max-w-2xl m-auto">
      {posts.map(post => (
        <article className="group" key={post.slug}>
          <h3 className="text-gray-600 text-2xl font-black group-hover:text-pink-400">
            <Link href={post.slug}>
              <a>{post.frontmatter.title}</a>
            </Link>
          </h3>
          <small className="text-gray-700">{post.frontmatter.date}</small>
          <p className="my-4 text-gray-700 text-xl">
            {post.frontmatter.description}
          </p>
        </article>
      ))}
    </section>
  )
}
