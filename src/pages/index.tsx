import type { Post } from 'api'
import { allPosts } from 'api'
import { Posts } from 'components/posts'
import { Header } from 'components/header'
import { Footer } from 'components/footer'

const AVATAR_SIZE = 48

type Props = {
  posts: Post[]
}

const IndexPage = ({ posts }: Props) => {
  return (
    <>
      <Header size={AVATAR_SIZE} />

      <main className="w-full px-4 py-8">
        <Posts posts={posts} />
      </main>

      <Footer />
    </>
  )
}

export const getStaticProps = async () => {
  const posts = await allPosts()

  return {
    props: { posts },
  }
}

export default IndexPage
