module.exports.Lexer = function Lexer(opts) {
  this.opts = opts
  this.ruleset = (this.opts.ruleset || []).map(rule => {
    rule.tokenize.prototype.render = rule.render
    return rule
  })
}

Lexer.prototype.lex = function (markdown) {
  if (!markdown) return []
  let tokens = []
  let l = markdown.length
  let rl = this.ruleset.length
  while (markdown) {
    for (let i = 0; i < rl; i++) {
      const rule = this.ruleset[i]
      let match
      if (rule.match instanceof RegExp) {
        match = rule.match.exec(markdown)
      } else {
        match = rule.match(markdown)
      }
      if (match !== null) {
        const token = new rule.tokenize(match)
        tokens.push(token)
        markdown = markdown.substring(token.length)
        break
      }
    }
    if (l === markdown.length) {
      throw Error(`Infinite loop detected. Have you included a 'catch-all' rule?`)
    }
    l = markdown.length
  }
  return tokens
}
