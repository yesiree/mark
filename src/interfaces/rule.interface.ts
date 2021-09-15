import { Token } from './token.interface'


export type InlineParserFn = (source: string) => Token[]

export interface Rule {
  name: string
  match?: RegExp
  block?: boolean
  repeat?: boolean
  tags?: [RegExp, RegExp]
  replacementTags?: [string, string]
  tokenize(match: RegExpExecArray | RegExpExecArray[], parseInline?: InlineParserFn): Token
  render(token?: Token): string
}
