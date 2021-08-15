import { allCategories, allPosts, Post } from 'api'
import { Posts } from 'components/posts'

type Props = {
  posts: Post[]
}

const IndexPage = ({ posts }: Props) => {
  return <Posts posts={posts} />
}

export const getStaticProps = async () => {
  const posts = await allPosts()
  const categories = await allCategories()

  console.log(categories)

  return {
    props: { posts },
  }
}

export default IndexPage
