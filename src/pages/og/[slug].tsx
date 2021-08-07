import { allPosts, Post, post } from 'api'

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

export default function OpenGraphImage({ post }: Props) {
  return (
    <section className="flex h-screen w-screen bg-gray-100 fixed top-0 left-0 p-6">
      <article
        className="p-4 bg-white flex-1 shadow-xl grid place-items-center"
        style={{ gridTemplateRows: '1fr 70px' }}
      >
        <div className="space-y-6 text-center">
          <h1 className="text-pink-400 text-8xl font-black">
            {post.frontmatter.title}
          </h1>
          <p className="text-xl text-gray-600">{post.frontmatter.date}</p>

          <div className="mt-8 space-x-4">
            {post.frontmatter.categories.map(({ slug, name }) => (
              <span
                key={slug}
                className="inline-block font-semibold p-2 rounded-md text-sm"
                style={{ backgroundColor: COLORS[slug as COLOR] }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xl italic text-gray-500">
          https://iamwallace.dev/
          <strong className="text-pink-400">{post.slug}</strong>
        </p>
      </article>
    </section>
  )
}

type Context = {
  params: {
    slug: string
  }
}

export const getStaticProps = async ({ params }: Context) => {
  const { slug } = params

  const result = await post(slug)

  return {
    props: {
      post: {
        ...result,
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
