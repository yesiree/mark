const defaults = {
  ruleset: {
    block: [
      {
        name: 'heading',
        match: /^(#{1,6})[^\S\n]+([^\n]*)(\n|$)/,
        tokenize(match, inline) {
          const [_, level, content] = match
          return {
            level: level.length,
            childTokens: inline(content)
          }
        },
        render(token) {
          const content = token
            .childTokens
            .map(x => x.render())
            .join('')
          return `<h${token.level}>${content}</h${token.level}>`
        }
      },
      {
        name: 'blockquote',
        repeat: true,
        match: /^\s*>\s+([^\n]+)[\s]*/g,
        // match: /^>\s([^\n]*)/,
        tokenize(matches, inline) {
          return {
            paragraphs: matches.map(match => {
              const [_, content] = match
              return {
                childTokens: inline(content)
              }
            })
          }
        },
        render(token) {
          const paragraphs = token.paragraphs
            .map(token => {
              const content = token
                .childTokens
                .map(x => x.render())
                .join('')
              return `  <p>${content}</p>`
            })
            .join('\n')
          return `<blockquote>\n${paragraphs}\n</blockquote>`
        }
      },
      {
        name: 'codeblock',
        match: /^\`\`\`([^\n]*)([\s\S]*)\n\`\`\`/,
        tokenize(match) {
          const [_, language, code] = match
          return {
            language,
            code
          }
        },
        render(token) {
          return `<pre><code language="${token.language}">${token.code}</code></pre>`
        }
      },
      {
        name: 'unordered-list',
        repeat: true,
        match: /^\s*-\s+([^\n]+)\s*/g,
        // match: /^[^\S\n]+(-)[^\S\n]+([^\n]+)/,
        tokenize(matches, inline) {
          return {
            items: matches.map(match => {
              const [_, content] = match
              return {
                childTokens: inline(content)
              }
            })
          }
        },
        render(token) {
          const items = token.items
            .map(item => {
              const content = item.childTokens
                .map(x => x.render())
                .join('')
              return `  <li>${content}</li>`
            })
            .join('\n')
          return `<ul>\n${items}\n</ul>`
        }
      },
      {
        name: 'ordered-list',
        repeat: true,
        match: /^\s*\d+\.\s+([^\n]+)\s*/g,
        // match: /^[^\S\n]+(\d+\.)[^\S\n]+([^\n]+)/,
        tokenize(matches, inline) {
          return {
            items: matches.map(match => {
              const [_, content] = match
              return {
                childTokens: inline(content)
              }
            })
          }
        },
        render(token) {
          const items = token.items
            .map(item => {
              const content = item.childTokens
                .map(x => x.render())
                .join('')
              return `  <li>${content}</li>`
            })
            .join('\n')
          return `<ol>\n${items}\n</ol>`
        }
      },
      {
        name: 'line',
        match: /^[^\S\n]*(\*\*\*|---)[^\S\n]*/,
        tokenize(match) {
          return {}
        },
        render(token) {
          return `<hr />`
        }
      }
    ],
    inline: [
      {
        name: 'link',
        match: /^(\[[^\]\n]+\])(\([^)\n]+\))/,
        tokenize(match, inline) {
          const [_, content, url] = match
          return {
            childTokens: inline(content),
            url
          }
        },
        render(token) {
          const content = token.childTokens
            .map(x => x.render())
            .join('')
          return `<a href="${token.url}">${content}</a>`
        }
      },
      {
        name: 'strong',
        tags: [/^\*\*(?!(\s|$))/, /(?<!\s)\*\*(?!\*)/],
        replacementTags: ['<strong>', '</strong>'],
      },
      {
        name: 'em',
        tags: [/^\*(?!(\s|$))/, /(?<!(^|\s))\*/],
        replacementTags: ['<em>', '</em>']
      },
      {
        name: 'code',
        tags: [/^`/, /`/],
        replacementTags: ['<code>', '</code>']
      }
    ]
  }
}

const getTokenAndOffset = (rule, source, parseInline) => {
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
    if (!match.length) return [0, null]
  } else {
    match = rule.match.exec(source)
    if (!match) return [0, null]
    skip = match[0].length
  }
  rule.match.lastIndex = 0
  if (rule.name === 'ordered-list') {
    // console.dir(match)
  }
  const token = rule.tokenize(match, parseInline)
  token.type = rule.name
  token.render = rule.render.bind(null, token)
  return {
    skip,
    token
  }
}

const getTextToken = text => {
  const token = {
    text,
    render() {
      return this.text
    }
  }
  // console.dir(token)
  return token
}

const parse = (source, ruleset = { block: [], inline: [] }) => {
  source = source.trim()
  const parseInline = (source) => {
    const tokens = []
    const length = source.length
    let i = 0
    let text = ''
    while (i < length) {
      const initial = i
      for (let rule of ruleset.inline) {
        let token, skip = 0
        if (rule.match) {
          ({ skip, token } = getTokenAndOffset(
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
          contentIndex = i + startMatch.index + startMatch[0].length
          const endMatch = closing.exec(source.slice(contentIndex))
          if (!endMatch) continue
          const content = source.slice(contentIndex, contentIndex + endMatch.index)
          if (rule.name === 'strong') {
            console.dir({ startMatch, endMatch, content })
          }
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
            tokens.push(getTextToken(text))
            text = ''
          }
          // console.dir(token)
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
      tokens.push(getTextToken(text))
      text = ''
    }
    return tokens
  }

  const tokens = []
  const length = source.length
  let i = 0
  while (i < length) {
    const initial = i
    const whitespace = /\s*/.exec(source.slice(i))
    if (whitespace) i += whitespace[0].length
    for (let rule of ruleset.block) {
      if (rule.match) {
        const { skip, token } = getTokenAndOffset(
          rule,
          source.slice(i),
          parseInline
        )
        if (!token) continue
        i += skip
        // console.dir({ i, token })
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
        childTokens: parseInline(content),
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

const render = (tokens) => {
  return tokens
    .map(token => token.render())
    .join('\n')
}

function Mark(opts) {
  this.opts = opts
}

Mark.prototype.convert = function (source) {
  return render(parse(source, this.opts.ruleset))
}

// Test

const fs = require('fs')
const markdown = fs.readFileSync('./test.md').toString()
const html = new Mark(defaults).convert(markdown)
fs.writeFileSync('./converted.html', html)
