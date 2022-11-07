export interface iLinkRef {
  label: string
  dest: string
  title: string
}

export class LinkRefCollection {
  // Regex for matching link reference definitions
  //
  //  Part 1 — The Label
  //  ^ {0,3}\[((?:[^\]\s]|\\\]){1,999})(?<!\\)\]:[^\S\n]*\n?[^\S\n]*
  //
  //  Part 2 — The Destination
  //  ((?![<\s])(?:\((?:[^)(\s]+|\((?:[^)(\s]+|\((?:[^)(\s]+|\([^)(\s]+\))*\))*\))*\)|\\\(|\\\)|[^()\s])+|<(?:(?:(?![<>]).|\\[<>])+)(?<!\\)>)
  //
  //  Part 3 — The Title
  //  (?:[^\S\n]*\n[^\S\n]*|[^\S\n]+)((?!\\)('|")((?:(?!\4).|\\\4|\n(?!\n))+)(?<!\\)\4|\(((?:(?!\)).|\\\)|\n(?!\n))+)(?<!\\)\))
  //
  //  This regex matches stuff like this...
  //
  //  [label]: </url> "title"
  //  [label]: (one(two(three(four)))) 'title'
  //  [label]: /path/file.ext (title)
  //
  //  See here: https://github.github.com/gfm/#link-reference-definition
  static linkRefRegExp = /^ {0,3}\[((?:[^\]\s]|\\\]){1,999})(?<!\\)\]:[^\S\n]*\n?[^\S\n]*((?![<\s])(?:\((?:[^)(\s]+|\((?:[^)(\s]+|\((?:[^)(\s]+|\([^)(\s]+\))*\))*\))*\)|\\\(|\\\)|[^()\s])+|<(?:(?:(?![<>]).|\\[<>])+)(?<!\\)>)(?:[^\S\n]*\n[^\S\n]*|[^\S\n]+)((?!\\)('|")((?:(?!\4).|\\\4|\n(?!\n))+)(?<!\\)\4|\(((?:(?!\)).|\\\)|\n(?!\n))+)(?<!\\)\))/

  private linkRefs: { [key: string]: iLinkRef } = {}

  get(label: string): iLinkRef {
    return this.linkRefs[label]
  }

  consumeLinkRef(line: string): boolean {
    const match = LinkRefCollection.linkRefRegExp.exec(line)
    if (!match) return false
    const [_, label, dest, _3, _4, quotedTitle, parentheticalTitle] = match
    const title = quotedTitle || parentheticalTitle
    this.linkRefs[label] = { label, dest, title }
    return true
  }
}

interface UnconsumedStore {
  has(): boolean
  peek(): string[]
  consume(): void
  push(line: string): void
}

class UnconsumedStore implements UnconsumedStore {
  constructor(
    private lines: string[] = []
  ) { }
  has(): boolean {
    return this.lines.length > 0
  }
  peek(): string[] {
    return this.lines
  }
  consume(): void {
    this.lines = []
  }
  push(line: string): void {
    this.lines.push(line)
  }
}

interface TokenStore {
  has(): boolean
  get(): Token | undefined
  put(token?: Token): void
}

class TokenStore implements TokenStore {
  constructor(
    private token?: Token
  ) { }

  has(): boolean {
    return !!this.token
  }
  get(): Token | undefined {
    return this.token
  }
  put(token: Token): void {
    this.token = token
  }
}

interface InlineParser {
  parseInline(text: string): Token[]
}

interface Helper {
  unconsumed: UnconsumedStore
  tokenStore: TokenStore
  parser: InlineParser
}

interface TokenParent {
  children?: Token[]
}

interface Token extends TokenParent {
  rule: PrivateRule
  open: boolean
  inline?: string
  [key: string]: any
}

interface AbstractRule {
  level: 'block' | 'inline'
  desc: string
  inline?(token: Token, helper: Helper): void
  render(token: Token): string
  [key: string]: any
}

interface ScanRule extends AbstractRule {
  scan(line: string, helper: Helper): number | undefined | null
}

type BlockRule = ScanRule

interface TagRule extends AbstractRule {
  level: 'inline'
  tags: [string, string | undefined]
}

interface TextRule extends AbstractRule { }

type InlineRule = ScanRule | TagRule
type PrivateRule = BlockRule | InlineRule | TextRule
type Rule = ScanRule | TagRule


class Tree implements InlineParser, TokenParent {
  open: boolean = true
  children: Token[] = []
  unconsumed: UnconsumedStore = new UnconsumedStore()
  linkRefs = new LinkRefCollection()

  constructor(
    private blockRules: BlockRule[] = [],
    private inlineRules: InlineRule[] = []
  ) { }

  print(children: Token[] = this.children, depth = '') {
    console.dir(this.children)
    return
    if (!Array.isArray(children)) return
    children.forEach(child => {
      const obj = { ...child } as any
      delete obj['rule']
      delete obj['children']
      console.log(depth + '%s(%o, %d)', child.rule.desc, child.open, child.children?.length || 0)
      // console.log(depth, child.rule?.desc || '<NO RULE>', JSON.stringify(obj))
      if (!Array.isArray(child.children)) return
      this.print(child.children, depth + '  ')
    })
  }

  parse(line: string) {
    line && console.dir(line)

    if (!line) { // TODO: ..?
      if (this.unconsumed.has()) {
        this.wrapUpParagraph()
      }
      this.close(this.children)
      return
    }

    let {
      subline = line,
      deepestMatch = null
    } = this.getDeepestMatch(line, this.children) || {}

    console.log(`   //  after match: |${subline}|`)

    subline = this.createDeepestMatch(
      subline,
      deepestMatch || this
    )

    console.log(`   // after create: |${subline}|`)

    if (this.linkRefs.consumeLinkRef(subline)) return

    if (subline)  {
      // TODO: ..?
    }

    // if (deepestMatch && subline) {
    //   if (!deepestMatch.text) {
    //     deepestMatch.text = []
    //   }
    //   deepestMatch.text.push(subline)
    // } else if (subline) {
    //   this.unconsumed.push(subline)
    // }
  }

  parseInline(text: string): Token[] {
    return []
  }

  wrapUpParagraph() {
    if (!this.unconsumed.has()) return
    const deepestOpen = this.getDeepestOpen(this.children) || this
    const lines = this.unconsumed.peek()
    const paragraph = this.getTextToken(lines)
    if (!Array.isArray(deepestOpen.children)) {
      deepestOpen.children = []
    }
    deepestOpen.children.push(paragraph)
    this.unconsumed.consume()
  }

  getDeepestOpen(children: Token[] = this.children): Token | null {
    if (!Array.isArray(children)) return null
    const last = children[children.length - 1]
    if (!last || !last.open || !Array.isArray(last.children)) return null
    return this.getDeepestOpen(last.children) || last
  }

  getDeepestMatch(subline: string, children: Token[] = this.children): {
    subline: string,
    deepestMatch: Token
  } | null {
    if (!Array.isArray(children)) return null
    const last = children[children.length - 1]
    if (!last || !last.open || !('scan' in last.rule)) return null
    const helper = {
      parser: this,
      tokenStore: new TokenStore(last),
      unconsumed: this.unconsumed
    }
    const len = last.rule.scan(subline, helper)
    if (typeof len !== 'number') return null
    subline = subline.slice(len)
    const deeper = Array.isArray(last.children)
      ? this.getDeepestMatch(subline, last.children)
      : null
    return deeper || {
      subline,
      deepestMatch: last
    }
  }

  createDeepestMatch(line: string, pointer: TokenParent): string {
    const foo = line
    for (let rule of this.blockRules) {
      const helper = {
        parser: this,
        tokenStore: new TokenStore(),
        unconsumed: this.unconsumed,
        rule
      }
      const len = rule.scan(line, helper)
      if (typeof len !== 'number') continue
      const token = helper.tokenStore.get()
      if (!token) throw new Error(`While processing rule '${rule.desc}', a match was found but no token was provided.`)
      this.wrapUpParagraph()
      this.close(pointer.children)
      if (!pointer.children) pointer.children = []
      const obj = { ...token } as any
      delete obj.rule
      // console.log(`  ! create(${rule.desc})`, line, JSON.stringify(obj))
      pointer.children.push(token)
      line = line.slice(len)
      return this.createDeepestMatch(line, token)
    }
    return line
  }

  getTextToken(text: string[]): Token {
    return {
      open: false,
      inline: text.join('\n'),
      rule: {
        level: 'block',
        desc: '<TEXT>',
        render(token: Token): string {
          return (token.children || [])
            .map(child => child.rule.render(child))
            .join('')
        }
      }
    }
  }

  close(children?: Token[]): void {
    if (!Array.isArray(children)) return
    const child = children[children.length - 1]
    if (!child) return
    child.open = false
    if (!Array.isArray(child.children)) return
    this.close(child.children)
  }

  finalize() {
    this.wrapUpParagraph()
    this.close(this.children)
  }
}

type RuleCollection = Rule[] | {
  [key in string | number]: Rule
}

interface MarkConfig {
  rules: RuleCollection
}

class Mark {
  private blockRules: BlockRule[] = []
  private inlineRules: InlineRule[] = []

  constructor(
    private config: MarkConfig
  ) {
    for (let k in this.config.rules) {
      const rule = this.config.rules[k]
      if (rule.level === 'block') {
        this.blockRules.push(rule)
      } else if (rule.level === 'inline') {
        this.inlineRules.push(rule)
      } else {
        throw new Error(`Invalid rule level '${rule.level}' in rule '${rule.desc || JSON.stringify(rule)}'.`)
      }
    }
  }

  convertString(markdown: string): string {
    const tree = new Tree(this.blockRules, this.inlineRules)
    markdown
      .split('\n')
      .forEach(line => tree.parse(line))
    return ''
  }

  debug(markdown: string): void {
    const tree = new Tree(this.blockRules, this.inlineRules)
    markdown
      .split('\n')
      .forEach(line => tree.parse(line))
    tree.print()
  }
}



const rules: RuleCollection = {
  blockquote: {
    level: 'block',
    desc: 'blockquote',
    pattern: /^ {0,3}>/,
    scan(line: string, helper: Helper) {
      const match = this.pattern.exec(line)
      if (!match) return
      const token = helper.tokenStore.get()
      if (!token) {
        helper.tokenStore.put({
          open: true,
          rule: this
        })
      }
      return match[0].length
    },
    parse(meta: any) { },
    render(token: Token): string {
      return ''
    }
  },
  heading: {
    level: 'block',
    desc: 'heading',
    pattern: /^ {0,3}(#{1,6})(?:$| )/,
    scan(line: string, helper: Helper) {
      const match = this.pattern.exec(line)
      if (!match) return
      const [_, level] = match
      helper.tokenStore.put({
        open: true,
        level: level.length,
        rule: this
      })
      return _.length
    },
    render(token: Token): string {
      return this.desc
    }
  },
  // heading2: {
  //   level: 'block',
  //   desc: 'heading',
  //   pattern: /^ {0,3}(#{1,6})(?:$| [^\S\n]*(.*)(?:(?<=\S)[^\S\n]*)$)/,
  //   scan(line: string, helper: Helper) {
  //     const match = this.pattern.exec(line)
  //     if (!match) return
  //     const [_, level, content] = match
  //     helper.tokenStore.put({
  //       open: true,
  //       level: level.length,
  //       inline: content,
  //       rule: this
  //     })
  //     return _.length
  //   },
  //   parse(meta: any) { },
  //   render(token: Token): string {
  //     return ''
  //   }
  // },
  codeblock: {
    level: 'block',
    desc: 'codeblock',
    opening: /^ {0,3}(?:\`{3,}($|(?:[^`\n]+)))$/,
    closing: /^ {0,3}\`{3,}\s*$/,
    scan(line: string, helper: Helper) {
      const token = helper.tokenStore.get()
      if (!token) {
        const match = this.opening.exec(line)
        if (!match) return
        const [_, info] = match
        helper.tokenStore.put({
          open: true,
          info,
          code: [],
          rule: this
        })
        return _.length
      } else {
        const match = this.closing.exec(line)
        if (match) {
          token.open = false
          return line.length // TODO: is this the right amount to consume? any parsing after match[0].length?
        } else {
          token.code.push(line)
          return line.length
        }
      }
    },
    parse() { },
    // inline(token: Token, helper: Helper) { },
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
markdown = `# Hello.`


const mark = new Mark({ rules })
mark.debug(markdown)




































/*

    tree
      -> nodes[]


    rule
      -> description
      -> block | inline
      -> scan | pattern | tag
      ->


    node
      -> open
      -> meta..?
      -> children
      -> inline?





    block
      prefix container (scan & capture)
      prefix container zero length (scan & capture)
      match (scan & capture)
      fence (scan & capture)

    inline
      recursive container (tags)
      container (tags)
      match (scan & capture)



    heading
    blockquote
    list/item
    codeblock

    link
    bold
    autolink

*/












































































// interface MatchResult {
//   matched: boolean
//   length: number
// }

// export interface UnusedLines {
//   lines: string[]
//   get hasLines(): boolean
//   push(line: string): void
//   peek(): string[]
//   consume(): void
// }

// enum RuleState {
//   New = 'new',
//   Opened = 'opened',
//   Closed = 'closed'
// }

// abstract class Rule {
//   state: RuleState = RuleState.New
//   abstract label: string

//   abstract render(): string

//   constructor() {
//     if (this.constructor === Rule) {
//       throw new Error(`Class 'Rule' is abstract. Cannot instantiate directly.`)
//     }
//   }
// }

// abstract class BlockRule extends Rule {
//   abstract scan(line: string, unused: UnusedLines): MatchResult
// }

// abstract class InlineRule extends Rule {
//   abstract scan(line: string, unused: UnusedLines): MatchResult
// }

// abstract class InlineTagRule extends Rule {
//   abstract openingTag: string
//   abstract closingTag: string
// }


// class CodeBlockToken extends Rule {
//   static opening = /^ {0,3}(?:\`{3,}($|(?:[^`\n]+)))$/
//   static closing = /^ {0,3}\`{3,}\s*$/

//   label = 'codeblock'

//   scan(line: string, unused: UnusedLines): MatchResult {
//     return {
//       matched: true,
//       length: 0
//     }
//   }

//   render(): string {
//     throw new Error('Method not implemented.')
//   }
// }

// class CodeBlockRule extends CodeBlockToken {
//   scan(line: string, unused: UnusedLines): MatchResult {
//     return {
//       matched: false,
//       length: 10
//     }
//   }
// }
