import { MatchResult } from './common.interface'
import { AstDocument } from './parsing/ast-document.class'
import { InternalFenceRule, InternalPatternRule, InternalRule, InternalScanRule, InternalTagRule, RuleType } from './private.interface'
import { FenceRule, MarkConfig, PatternRule, Rule, ScanRule, TagRule } from './public.interface'
import { Renderer } from './rendering/renderer.class'

export class Mark {
  private blockRules: InternalRule[] = []
  private inlineRules: InternalRule[] = []

  constructor(
    private config: MarkConfig
  ) {
    for (let k in this.config.rules) {
      const rule = this.config.rules[k]
      let internalRule
      if ('scan' in rule) {
        internalRule = this.getScanRule(rule)
      } else if ('pattern' in rule) {
        internalRule = this.getPatternRule(rule)
      } else if ('opening' in rule) {
        internalRule = this.getFenceRule(rule)
      } else if ('tags' in rule) {
        internalRule = this.getTagRule(rule)
      } else {
        throw new Error(`Invalid rule: ${JSON.stringify(rule, null, 2)}`)
      }
      if (rule.level === 'block') {
        this.blockRules.push(internalRule)
      } else if (rule.level === 'inline') {
        this.inlineRules.push(internalRule)
      }
    }
  }

  private getScanRule(rule: ScanRule): InternalScanRule {
    return { ...rule, type: RuleType.Scan }
  }

  private getPatternRule(rule: PatternRule): InternalPatternRule {
    return { ...rule, type: RuleType.Pattern }
  }

  private getFenceRule(rule: FenceRule): InternalFenceRule {
    const opening = rule.opening instanceof RegExp
      ? (source: string) => {
        const match = (rule.opening as RegExp).exec(source)
        return {
          match: !!match,
          length: match ? match[0].length : 0,
          meta: match
        }
      }
      : rule.opening
    const closing = rule.closing instanceof RegExp
      ? (source: string, meta: any[]) => {
        const match = (rule.closing as RegExp).exec(source)
        return {
          match: !!match,
          length: match ? match[0].length : 0,
          meta: match
        }
      }
      : rule.closing
    return {
      ...rule,
      level: 'block',
      type: RuleType.Fence,
      opening,
      closing
    }
  }

  private getTagRule(rule: TagRule): InternalTagRule {
    return { ...rule, level: 'inline', type: RuleType.Tag }
  }

  convertString(markdown: string): string {
    const doc = new AstDocument(this.blockRules, this.inlineRules)
    markdown.split('\n').forEach(line => {
      doc.parseLine(line)
    })
    const renderer = new Renderer(doc)
    return ''
  }

  debug(markdown: string): void {
    const doc = new AstDocument(this.blockRules, this.inlineRules)
    markdown.split('\n').forEach(line => {
      doc.parseLine(line)
    })
    doc.debug()
  }

  private getRuleType(rule: any): RuleType {
    if (rule['pattern'] instanceof RegExp) return RuleType.Pattern
    if (Array.isArray(rule['tags']) && rule['tags'].length) return RuleType.Tag
    if (typeof rule['scan'] === 'function') return RuleType.Scan
    if (Array.isArray(rule['text'])) return RuleType.Text
    throw new Error(`Invalid rule! ${JSON.stringify(rule, null, 2)}`)
  }
}
