const defaults = {

}

export function Mark(opts = {}) {
  opts = { ...defaults, ...opts }
}

Mark.prototype.convert = function (markdown) {

  // return this.renderer.render(this.lexer.lex(markdown))
}


export interface Token {
  type: string
  inlineContent: string | string[]
  render(): string
}

export interface Rule {
  name: string
  match: RegExp | ((source: string) => any)
  tokenize(match: any): Token
}

const ExampleRule: Rule = {
  name: 'example',
  match: /^[^\n*]+/,
  tokenize(match) {
    const [text] = match
    this.text = text
    const re = /foo/
    re.exec('bar')
    return {

      render() {
        return ''
      }
    }
  }
}

const tokenizer = (source, rules = [ExampleRule]) => {
  const length = source.length
  let i = 0
  while (i < length) {
    for (let rule of rules) {
      const match = rule.match instanceof RegExp
        ? rule.match.exec(source.slice(i))
        : rule.match(source.slice(1))
      if (!match) continue
      rule.tokenize(match)
    }
  }
}

const renderer = (tokens) => {

}


const tokens: any = {

}
