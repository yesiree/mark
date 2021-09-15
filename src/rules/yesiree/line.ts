export const line = {
  block: true,
  name: 'line',
  match: /^[^\S\n]*(\*\*\*|---)[^\S\n]*/,
  tokenize(match) {
    return {}
  },
  render(token) {
    return `<hr />`
  }
}
