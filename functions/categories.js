import { allCategories } from '../../api/posts'

exports.handler = async () => {
  const categories = await allCategories()

  return {
    statusCode: 200,
    body: JSON.parse({
      categories,
    }),
  }
}
