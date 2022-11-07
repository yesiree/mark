import { Mark } from '.'
import { MatchResult, Token } from './common.interface'
import { RuleCollection } from './public.interface'

const rules: RuleCollection = {
  blockquote: {
    level: 'block',
    desc: 'blockquote',
    pattern: /^ {0,3}>/,
    parse(meta: any): Token {
      return {
        meta: {}
      }
    },
    render(token: Token): string {
      return ''
    }
  },
  heading: {
    level: 'block',
    desc: 'heading',
    pattern: /^ {0,3}(#{1,6})(?:$| [^\S\n]*(.*)(?:(?<=\S)[^\S\n]*)$)/,
    parse(meta: any): Token {
      return {
        meta: {}
      }
    },
    render(token: Token): string {
      return ''
    }
  },
  codeblock: {
    level: 'block',
    desc: 'codeblock',
    scan(line: string, meta: any[]): MatchResult {
      const opening = /^ {0,3}(?:\`{3,}($|(?:[^`\n]+)))$/
      const closing = /^ {0,3}\`{3,}\s*$/
      if (meta.length === 0) {
        const match = opening.exec(line)
      } else {
        const match = closing.exec(line)
        if (!match) {
          return {
            match: true,
            length: line.length,
            meta: line
          }
        } else {
          return {
            match: true,
            length: match[0].length
          }
        }
      }
      return {
        match: true,
        length: 0,
        meta: {}
      }
    },
    // opening: /^ {0,3}(?:\`{3,}($|(?:[^`\n]+)))$/,
    // closing: /^ {0,3}\`{3,}\s*$/,
    parse(meta: any): Token {
      return {
        meta: {}
      }
    },
    render(token: Token): string {
      return ''
    }
  }
}



let markdown = `
# Hello.

> # Sub heading in a block quote

This is a paragraph.
  ...and more!

> Blockquote paragraph?

\`\`\`javascript
const foo = 'bar'

\`\`\`

[label]: <url> "title"
`



const mark = new Mark({ rules })
mark.debug(markdown)
