import { getAllPosts } from 'api/posts'
import { Layout } from 'components/Layout'

type Props = {
  posts: any[]
}

const IndexPage = ({ posts }: Props) => {
  console.log(posts)

  return (
    <Layout>
      <h2>Teste</h2>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const posts = getAllPosts()
  return { props: { posts } }
}

export default IndexPage
