export interface Token {
  render(token?: Token): string
  [other: string]: any
}
