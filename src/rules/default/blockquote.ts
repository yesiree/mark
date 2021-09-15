import { InlineParserFn } from '../../interfaces/rule.interface'
import { Token } from '../../interfaces/token.interface'

export const blockquote = {
  block: true,
  name: 'blockquote',
  repeat: true,
  match: /^\s*>\s+([^\n]+)[\s]*/g,
  tokenize(matches: RegExpExecArray[], parseInline: InlineParserFn) {
    return {
      paragraphs: matches.map(match => {
        const [_, content] = match
        return {
          childTokens: parseInline(content)
        }
      })
    }
  },
  render(token: Token) {
    const paragraphs = token.paragraphs
      .map((token: Token) => `<p>${token.childTokens}</p>`)
      .join('')
    return `<blockquote>\n${paragraphs}\n</blockquote>`
  }
}
