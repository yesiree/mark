export const link = {
  name: 'link',
  match: /^(\[[^\]\n]+\])(\([^)\n]+\))/,
  tokenize(match, inline) {
    const [_, content, url] = match
    return {
      childTokens: inline(content),
      url
    }
  },
  render(token) {
    const content = token.childTokens
      .map(x => x.render())
      .join('')
    return `<a href="${token.url}">${content}</a>`
  }
}
