import Markdown from 'react-markdown'
import type { Post } from 'api'
import { allPosts, getPostBySlug } from 'api'
import { Header } from 'components/header'
import {
  Code,
  Paragraph,
  H2,
  H3,
  A,
  Image,
  Blockquote,
  List,
  Li,
} from 'components/post'
import { Footer } from 'components/footer'

const AVATAR_SIZE = 48

type Props = {
  post: Post
}

const PostPage = (props: Props) => {
  return (
    <>
      <Header size={AVATAR_SIZE} />

      <section className="w-full max-w-2xl m-auto">
        <header className="w-full py-60 text-center">
          <h2 className="text-6xl text-gray-600 font-black">
            {props.post.frontmatter.title}
          </h2>
          <small className="text-lg mt-6 block text-gray-500">
            {props.post.frontmatter.date}
          </small>
          {props.post.frontmatter.category ? (
            <div className="mt-4">
              <a
                href="categoria/graphql"
                className="bg-pink-400 font-semibold p-2 rounded-md text-xs"
              >
                {props.post.frontmatter.category}
              </a>
            </div>
          ) : null}
        </header>

        <article className="max-w-prose pb-24">
          <Markdown
            components={{
              h2: H2,
              h3: H3,
              p: Paragraph,
              code: Code,
              a: A,
              img: Image,
              blockquote: Blockquote,
              ul: List,
              li: Li,
            }}
          >
            {props.post.content}
          </Markdown>
        </article>
      </section>

      <Footer />
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
