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
import { SEO } from 'components/seo'

const AVATAR_SIZE = 48

type Props = {
  post: Post
}

const PostPage = (props: Props) => {
  return (
    <>
      <SEO
        title={props.post.frontmatter.title}
        description={props.post.frontmatter.description}
        image={props.post.frontmatter.cover}
      />

      <Header size={AVATAR_SIZE} />

      <section className="w-full max-w-2xl m-auto">
        <header className="w-full px-6 py-24 text-center space-y-2">
          <h2 className="text-4xl text-gray-600 font-black">
            {props.post.frontmatter.title}
          </h2>

          <small className="text-lg block text-gray-500">
            {props.post.frontmatter.date}
          </small>

          {props.post.frontmatter.category ? (
            <div>
              <a
                href="categoria/graphql"
                className="bg-pink-400 font-semibold p-2 rounded-md text-xs"
              >
                {props.post.frontmatter.category}
              </a>
            </div>
          ) : null}
        </header>

        <article className="max-w-prose pb-24 px-6">
          <Markdown
            components={{
              a: A,
              blockquote: Blockquote,
              code: Code,
              h2: H2,
              h3: H3,
              img: Image,
              li: Li,
              p: Paragraph,
              ul: List,
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
