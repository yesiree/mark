import { Token } from './token.interface'

export interface Rule {
  name: string
  match: RegExp
  block?: boolean
  multi?: boolean
  tokenize(match: RegExpExecArray): Token
  render(token?: Token): string
}
