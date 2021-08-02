import Markdown from 'react-markdown'
import slugify from 'slugify'
import type { Post } from 'api'
import { allPosts, getPostBySlug } from 'api'
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
import { SEO } from 'components/seo'

type Props = {
  post: Post
}

const COLORS = {
  'react': '#5089C6',
  'graphql': '#B97A95',
  'frontend': '#F6AE99',
  'backend': '#EEEEEE',
  'game-development': '#C6B4CE',
  'nao-faco-ideia': '#F2E1C1',
}

type COLOR = keyof typeof COLORS

const PostPage = ({ post }: Props) => {
  return (
    <>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        image={post.frontmatter.cover}
      />

      <section className="w-full max-w-2xl px-4 m-auto">
        <header className="w-full py-24 text-center space-y-2 lg:py-60 lg:space-y-4">
          <h2 className="text-4xl text-gray-600 font-black lg:text-6xl">
            {post.frontmatter.title}
          </h2>

          <small className="text-lg block text-gray-500">
            {post.frontmatter.date}
          </small>

          {post.frontmatter.categories.map(category => {
            const slug = slugify(category, { lower: true }) as COLOR

            return (
              <a
                key={category}
                href={`categoria/${slug}`}
                className="inline-block font-semibold p-2 rounded-md text-xs"
                style={{ backgroundColor: COLORS[slug] }}
              >
                {category}
              </a>
            )
          })}
        </header>

        <article className="pb-24">
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
            {post.content}
          </Markdown>
        </article>
      </section>
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
