import Markdown from 'react-markdown'
import type { Post } from 'api'
import { allPosts, getPostBySlug } from 'api'
import { Header } from 'components/header'

const AVATAR_SIZE = 48

type Props = {
  post: Post
}

const PostPage = (props: Props) => {
  return (
    <>
      <Header size={AVATAR_SIZE} />

      <article className="w-full max-w-2xl m-auto">
        <section className="w-full py-60">
          <h2 className="text-6xl text-gray-600 font-black">
            {props.post.frontmatter.title}
          </h2>
          <small className="text-lg mt-6 block">
            {props.post.frontmatter.date}
          </small>
        </section>

        <div className="max-w-prose">
          <Markdown>{props.post.content}</Markdown>
        </div>
      </article>
    </>
  )
}

export default PostPage

type Context = {
  params: {
    slug: string
  }
}

export const getStaticProps = async ({ params }: Context) => {
  const { slug } = params

  const post = await getPostBySlug(slug)

  return {
    props: {
      post: {
        ...post,
        slug,
      },
    },
  }
}

export const getStaticPaths = async () => {
  const posts = await allPosts(['slug'])

  return {
    paths: posts.map(({ slug }) => ({
      params: { slug: slug },
    })),
    fallback: false,
  }
}
