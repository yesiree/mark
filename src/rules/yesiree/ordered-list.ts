export const orderedList = {
  block: true,
  name: 'ordered-list',
  repeat: true,
  match: /^\s*\d+\.\s+([^\n]+)\s*/g,
  tokenize(matches, inline) {
    return {
      items: matches.map(match => {
        const [_, content] = match
        return {
          childTokens: inline(content)
        }
      })
    }
  },
  render(token) {
    const items = token.items
      .map(item => {
        const content = item.childTokens
          .map(x => x.render())
          .join('')
        return `<li>${content}</li>`
      })
      .join('')
    return `<ol>${items}</ol>`
  }
}
