export const blockquote = {
  block: true,
  name: 'blockquote',
  repeat: true,
  match: /^\s*>\s+([^\n]+)[\s]*/g,
  // match: /^>\s([^\n]*)/,
  tokenize(matches, inline) {
    return {
      paragraphs: matches.map(match => {
        const [_, content] = match
        return {
          childTokens: inline(content)
        }
      })
    }
  },
  render(token) {
    const paragraphs = token.paragraphs
      .map(token => {
        const content = token
          .childTokens
          .map(x => x.render())
          .join('')
        return `<p>${content}</p>`
      })
      .join('')
    return `<blockquote>\n${paragraphs}\n</blockquote>`
  }
}
