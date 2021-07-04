declare module '*.md' {
  const attributes: {
    title: string
    date: Date
    cats: {
      name: string
      description: string
    }[]
  }

  const react: React.FC<attributes>

  export { attributes, react }
}
