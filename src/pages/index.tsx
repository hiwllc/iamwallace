import type { Post } from 'api'
import { allPosts } from 'api'
import { Posts } from 'components/posts'

type Props = {
  posts: Post[]
}

const IndexPage = ({ posts }: Props) => {
  return (
    <main className="w-full px-4 py-8">
      <Posts posts={posts} />
    </main>
  )
}

export const getStaticProps = async () => {
  const posts = await allPosts()

  return {
    props: { posts },
  }
}

export default IndexPage
