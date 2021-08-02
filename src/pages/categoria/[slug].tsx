import { allCategories, postsByCategory, Post } from 'api'
import { Posts } from 'components/posts'

type Props = {
  posts: Post[]
}

export default function Category({ posts }: Props) {
  return <Posts posts={posts} />
}

type Context = {
  params: {
    slug: string
  }
}

export const getStaticProps = async ({ params }: Context) => {
  const posts = await postsByCategory(params.slug)

  return {
    props: {
      slug: params.slug,
      posts: posts,
    },
  }
}

export const getStaticPaths = async () => {
  const categories = await allCategories()

  return {
    paths: categories.map(({ slug }) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  }
}
