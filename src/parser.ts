import { Options } from './interfaces/options.interface'
import { Token } from './interfaces/token.interface'


type TokenAndOffset = { skip: number, token: Token | null }

export function Parser(opts: Options) {
  this.opts = opts
  this.ruleset = opts.ruleset || []
  this.inlineRuleset = []
  this.blockRuleset = []
  this.ruleset.forEach(rule => {
    if (rule.block) {
      this.blockRuleset.push(rule)
    } else {
      this.inlineRuleset.push(rule)
    }
  })
}

Parser.prototype.parse = function parse(source: string): Token[] {
  source = source.trim()
  const tokens = []
  const length = source.length
  let i = 0
  while (i < length) {
    const initial = i
    const whitespace = /\s*/.exec(source.slice(i))
    if (whitespace) i += whitespace[0].length
    for (let rule of this.blockRuleset) {
      if (rule.match) {
        const { skip, token } = this._getTokenAndOffset(
          rule,
          source.slice(i),
          this.parseInline
        )
        if (!token) continue
        i += skip
        tokens.push(token)
        break
      } else {
        throw new Error(`Invalid block rule! No 'match' property.`)
      }
    }
    if (i === initial) {
      const match = /^\s*([^\n]*)(\s*\n\s*){2,}/.exec(source.slice(i))
      let content, count
      if (match) {
        content = match[0].trim()
        count = match[0].length
      } else {
        content = source.slice(i).trim()
        count = source.length - i
      }
      const token = {
        type: 'paragraph',
        childTokens: this.parseInline(content),
        render() {
          const content = this
            .childTokens
            .map(x => x.render())
            .join('')
          return `<p>${content}</p>`
        }
      }
      i += count
      tokens.push(token)
    }
  }
  return tokens
}

Parser.prototype.parseInline = function parseInline(source: string) {
  const tokens = []
  const length = source.length
  let i = 0
  let text = ''
  while (i < length) {
    const initial = i
    for (let rule of this.inlineRuleset) {
      let token, skip = 0
      if (rule.match) {
        ({ skip, token } = this._getTokenAndOffset(
          rule,
          source.slice(i),
          parseInline
        ))
      } else if (rule.tags) {
        if (!rule.render && !rule.replacementTags) {
          throw new Error(`Invalid inline rule. Must have either 'render' method or 'replacementTags' property.`)
        }
        const [opening, closing = opening] = rule.tags
        const startMatch = opening.exec(source.slice(i))
        if (!startMatch) continue
        const contentIndex = i + startMatch.index + startMatch[0].length
        const endMatch = closing.exec(source.slice(contentIndex))
        if (!endMatch) continue
        const content = source.slice(contentIndex, contentIndex + endMatch.index)
        token = {
          childTokens: parseInline(content),
          render: rule.render ? rule.render : () => {
            const [opening, closing] = rule.replacementTags
            const content = token
              .childTokens
              .map(token => token.render())
              .join('')
            return `${opening}${content}${closing}`
          }
        }
        skip = startMatch.index
          + startMatch[0].length
          + content.length
          + endMatch[0].length
      } else {
        throw new Error(`Invalid inline rule! No 'match' or 'tags' property.`)
      }
      if (token) {
        if (text) {
          tokens.push(this._getTextToken(text))
          text = ''
        }
        tokens.push(token)
        i += skip
        break
      }
    }
    if (i === initial) {
      text += source.slice(i, i + 1)
      i++
    }
  }
  if (text) {
    tokens.push(this._getTextToken(text))
    text = ''
  }
  return tokens
}


Parser.prototype._getTokenAndOffset = function _getTokenAndOffset(rule, source, parseInline): TokenAndOffset {
  let match, skip = 0
  if (rule.repeat) {
    if (!rule.match.global) {
      throw new Error(`Regular expression for repeating rule '${rule.name}' must use 'global' flag.`)
    }
    rule.match.lastIndex = 0
    const matches = []
    const length = source.length
    while (skip < length) {
      match = rule.match.exec(source.slice(skip))
      if (!match) break
      skip += match[0].length
      rule.match.lastIndex = 0
      matches.push(match)
    }
    match = matches
    if (!match.length) return { skip: 0, token: null }
  } else {
    match = rule.match.exec(source)
    if (!match) return { skip: 0, token: null }
    skip = match[0].length
  }
  rule.match.lastIndex = 0
  const token = rule.tokenize(match, parseInline)
  token.type = rule.name
  token.render = rule.render.bind(null, token)
  return {
    skip,
    token
  }
}

Parser.prototype._getTextToken = function _getTextToken(text: string): Token {
  return {
    text,
    render() {
      return this.text
    }
  }
}
