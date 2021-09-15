export const line = {
  name: 'line',
  match: /^[^\S\n]*(\*\*\*|---)[^\S\n]*/,
  tokenize(match) {
    return {}
  },
  render(token) {
    return `<hr />`
  }
}
