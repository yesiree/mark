import { InlineParserFn } from '../../interfaces/rule.interface'
import { Token } from '../../interfaces/token.interface'

export const orderedList = {
  block: true,
  name: 'ordered-list',
  repeat: true,
  match: /^\s*\d+\.\s+([^\n]+)\s*/g,
  tokenize(matches: RegExpExecArray[], parseInline: InlineParserFn) {
    return {
      items: matches.map(match => {
        const [_, content] = match
        return {
          childTokens: parseInline(content)
        }
      })
    }
  },
  render(token: Token) {
    const items = token.items
      .map((item: Token) => `<li>${item.childTokens}</li>`)
      .join('')
    return `<ol>${items}</ol>`
  }
}
