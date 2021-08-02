import { allPosts, Post } from 'api'
import { Posts } from 'components/posts'

type Props = {
  posts: Post[]
}

const IndexPage = ({ posts }: Props) => {
  return <Posts posts={posts} />
}

export const getStaticProps = async () => {
  const posts = await allPosts()

  return {
    props: { posts },
  }
}

export default IndexPage
