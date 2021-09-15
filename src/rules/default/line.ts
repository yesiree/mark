import { Token } from '../../interfaces/token.interface'

export const line = {
  block: true,
  name: 'line',
  match: /^[^\S\n]*(\*\*\*|---)[^\S\n]*/,
  tokenize(match: RegExpExecArray) {
    return {}
  },
  render(token: Token) {
    return `<hr />`
  }
}
