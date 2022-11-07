import { AstChildNode } from './ast-child-node.class'
import { AstNode } from './ast-node.class'
import { LinkRefCollection } from '../link-ref-collection.class'
import { InternalFenceRule, InternalPatternRule, InternalRule, InternalScanRule, InternalTagRule, RuleType } from '../private.interface'
import { ConcreteUnusedLines } from './unused-lines'
import { MatchResult, Token } from '../common.interface'

export class AstDocument implements AstNode {
  children: AstChildNode[] = []
  isOpen: boolean = true
  unused = new ConcreteUnusedLines()
  linkRefs = new LinkRefCollection()

  constructor(
    private blockRules: InternalRule[] = [],
    private inlineRules: InternalRule[] = []
  ) { }

  parseLine(line: string) {

    if (!line && this.unused.hasLines) {
      const deepestOpen = this.getDeepestOpen(this.children) || this
      const paragraph = this.getParagraphToken(deepestOpen, line)
      deepestOpen.children.push(paragraph)
      this.unused.consume()
      return
    }

    let {
      subline = line,
      deepestMatch = null
    } = this.getDeepestMatch(line, this.children) || {}

    console.log('\n')
    console.dir({
      subline,
      deepestMatch
    })

    if (deepestMatch) console.log(`Deepest: ${deepestMatch.rule.desc}`)

    subline = this.createDeepestMatch(
      subline,
      deepestMatch || this
    )

    if (this.linkRefs.consumeLinkRef(subline)) return

    if (deepestMatch && subline) {
      deepestMatch.text.push(subline)
    } else if (subline) {
      this.unused.push(subline)
    }

  }

  getDeepestOpen(children: AstChildNode[] = []): AstNode | null {
    const last = children[children.length - 1]
    if (!last || !last.isOpen) return null
    return this.getDeepestOpen(last.children) || last
  }


  getDeepestMatch(line: string, children: AstChildNode[] = []): {
    subline: string
    deepestMatch: AstChildNode
  } | null {
    if (!children || !children.length) return null
    let subline = line
    const last = children[children.length] || null
    if (!last || last.rule.level !== 'block' || !last.isOpen) return null

    let result
    switch (last.rule.type) {
      case RuleType.Scan:
        result = this.runScanMatch(last.rule, subline, last.meta)
        break
      case RuleType.Pattern:
        result = this.runPatternMatch(last.rule, subline)
        break
      case RuleType.Fence:
        result = this.runFenceMatch(last.rule, subline, last.meta)
        break
    }
    if (!result) return null
    subline = subline.slice(result.length || 0)
    if (result.meta) last.meta.push(result.meta)
    if (!result.match) return null

    let deeper = last.children
      ? this.getDeepestMatch(subline, last.children)
      : null

    return deeper || {
      subline,
      deepestMatch: last
    }
  }

  runScanMatch(rule: InternalScanRule, source: string, meta: any[]): MatchResult {
    return rule.scan(source, meta, this.unused)
  }

  runPatternMatch(rule: InternalPatternRule, source: string): MatchResult {
    const match = rule.pattern.exec(source)
    return {
      match: match ? true : false,
      length: match ? match[0].length : 0,
      meta: match
    }
  }

  runFenceMatch(rule: InternalFenceRule, source: string, meta: any[]): MatchResult {
    const { opening, closing } = rule
    const isFirstMatch = meta.length === 0
    if (isFirstMatch) {
      return opening(source)
    } else {
      const match = closing(source, meta)
      const newlineIndex = source.indexOf('\n')
      const lineLen = newlineIndex === -1
        ? source.length
        : newlineIndex
      return {
        match: !match,
        length: match ? match.length : lineLen,
        meta: match.meta
      }
    }
  }

  runTagMatch(rule: InternalTagRule, source: string, meta: any[]): MatchResult {
    const [opening, closing = opening] = rule.tags
    // TODO: ...
    return {
      match: false,
      length: 0,
      meta: null
    }
  }

  createDeepestMatch(line: string, pointer: AstNode): string {
    let subline = line
    for (let rule of this.blockRules) {
      let result
      switch (rule.type) {
        case RuleType.Scan:
          result = this.runScanMatch(rule, line, [])
          break
        case RuleType.Pattern:
          result = this.runPatternMatch(rule, line)
          break
        case RuleType.Fence:
          result = this.runFenceMatch(rule, line, [])
          break
      }
      if (!result || !result.match) continue
      const node: AstChildNode = {
        rule,
        isOpen: rule.level === 'block',
        parent: pointer,
        children: [],
        meta: result?.meta,
        text: []
      }
      subline = line.slice(result.length || 0)
      this.closeChildren(pointer.children)
      pointer.children.push(node)
      return this.createDeepestMatch(subline, node)
    }
    return subline
  }

  closeChildren(children: AstNode[]) {
    if (!children || !children.length) return
    const last = children[children.length - 1]
    if (!last) return
    last.isOpen = false
    this.closeChildren(last.children)
  }

  getParagraphToken(parent: AstNode, text: string): AstChildNode {
    return {
      isOpen: false,
      meta: [],
      parent: parent,
      children: [],
      text: this.unused.lines,
      rule: {
        level: 'block',
        type: RuleType.Text,
        desc: 'PARAGRAPH',
        text: [],
        parse(meta: any): Token {
          return {
            meta: {}
          }
        },
        render(token: Token): string {
          return token.meta
        }
      }
    }
  }

  print(children: AstChildNode[], depth = ''): any {
    if (!children) return undefined
    const kids = children as any
    return kids.forEach((kid: any) => {
      console.log(depth, kid.rule.desc)
      this.print(kid.children, depth + '  ')
    })
  }

  debug() {
    this.print(this.children)
  }
}
