export const heading = {
  block: true,
  name: 'heading',
  match: /^(#{1,6})[^\S\n]+([^\n]*)(\n|$)/,
  tokenize(match, inline) {
    const [_, level, content] = match
    return {
      level: level.length,
      childTokens: inline(content)
    }
  },
  render(token) {
    const content = token
      .childTokens
      .map(x => x.render())
      .join('')
    return `<h${token.level}>${content}</h${token.level}>`
  }
}
