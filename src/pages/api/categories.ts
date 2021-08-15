import { NextApiRequest, NextApiResponse } from 'next'
import { allCategories } from '../../api/posts'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const categories = await allCategories()

  response.status(200).json({ data: categories })
}
