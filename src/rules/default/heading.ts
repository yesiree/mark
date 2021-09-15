import { InlineParserFn } from '../../interfaces/rule.interface'
import { Token } from '../../interfaces/token.interface'


export const heading = {
  block: true,
  name: 'heading',
  match: /^(#{1,6})[^\S\n]+([^\n]*)(\n|$)/,
  tokenize(match: RegExpExecArray, parseInline: InlineParserFn) {
    const [_, level, content] = match
    return {
      level: level.length,
      slug: content
        .toLowerCase()
        .replace(/(^\W+|\W+$)/g, '')
        .replace(/\W+/g, '-'),
      childTokens: parseInline(content)
    }
  },
  render(token: Token) {
    return `<h${token.level} id="${token.slug}">${token.childTokens}</h${token.level}>`
  }
}
