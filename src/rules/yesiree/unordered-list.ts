export const unorderedList = {
  name: 'unordered-list',
  repeat: true,
  match: /^\s*-\s+([^\n]+)\s*/g,
  // match: /^[^\S\n]+(-)[^\S\n]+([^\n]+)/,
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
    return `<ul>${items}</ul>`
  }
}
