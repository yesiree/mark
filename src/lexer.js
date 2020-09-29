const Lexer = module.exports.Lexer = function Lexer(opts) {
  this.opts = opts
  const ruleset = this.opts.ruleset || []
  this.blockRules = []
  this.inlineRules = []
  const lexInline = this.lexWithRules.bind(this, this.inlineRules)
  const l = ruleset.length
  for (let i = 0; i < l; i++) {
    const rule = ruleset[i]
    rule.tokenize.prototype.render = rule.render
    rule.tokenize.prototype.lexInline = lexInline
    if (rule.inline) {
      this.inlineRules.push(rule)
    } else {
      this.blockRules.push(rule)
    }
  }
}

Lexer.prototype.lex = function (markdown) {
  return this.lexBlock(markdown)
}

Lexer.prototype.lexBlock = function (markdown) {
  return this.lexWithRules(this.blockRules, markdown)
}

Lexer.prototype.lexInline = function (markdown) {
  return this.lexWithRules(this.inlineRules, markdown)
}

Lexer.prototype.lexWithRules = function (rules, markdown) {
  if (!markdown) return []
  let tokens = []
  let l = markdown.length
  let rl = rules.length
  while (markdown) {
    for (let i = 0; i < rl; i++) {
      const rule = rules[i]
      let match
      if (rule.match instanceof RegExp) {
        match = rule.match.exec(markdown)
      } else {
        match = rule.match(markdown)
      }
      if (match !== null) {
        try {
          const token = new rule.tokenize(match)
          tokens.push(token)
          markdown = markdown.substring(token.length)
          break
        } catch (e) {
          console.error(e.message)
          throw e
        }
      }
    }
    if (l === markdown.length) {
      throw Error(`Infinite loop detected. Have you included a 'catch-all' block rule and inline rule?`)
    }
    l = markdown.length
  }
  return tokens
}
