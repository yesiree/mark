import { InlineParserFn } from '../../interfaces/rule.interface'
import { Token } from '../../interfaces/token.interface'

export const link = {
  block: false,
  name: 'link',
  match: /^(\[[^\]\n]+\])(\([^)\n]+\))/,
  tokenize(match: RegExpExecArray, parseInline: InlineParserFn) {
    const [_, content, url] = match
    return {
      childTokens: parseInline(content),
      url
    }
  },
  render(token: Token) {
    return `<a href="${token.url}">${token.childTokens}</a>`
  }
}
