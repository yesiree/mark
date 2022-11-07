import { MatchResult, Token, UnusedLines } from './common.interface'

export enum RuleType {
  Scan = 'scan',
  Pattern = 'pattern',
  Fence = 'fence',
  Tag = 'tag',
  Text = 'text'
}

export interface InternalAbstractRule {
  level: 'block' | 'inline'
  type: RuleType
  desc?: string
  parse(meta: any): Token
  render(token: Token): string
}

export interface InternalScanRule extends InternalAbstractRule {
  type: RuleType.Scan
  scan(line: string, meta: any[], unused: UnusedLines): MatchResult
}

export interface InternalPatternRule extends InternalAbstractRule {
  type: RuleType.Pattern
  pattern: RegExp
}

export interface InternalFenceRule extends InternalAbstractRule {
  level: 'block'
  type: RuleType.Fence
  opening: ((source: string) => MatchResult)
  closing: ((source: string, meta: any[]) => MatchResult)
}

export interface InternalTagRule extends InternalAbstractRule {
  level: 'inline'
  type: RuleType.Tag
  tags: [string, string | undefined]
}

export interface InternalTextRule extends InternalAbstractRule {
  type: RuleType.Text
  text: string[]
}

export type InternalRule =
  InternalScanRule |
  InternalPatternRule |
  InternalFenceRule |
  InternalTagRule |
  InternalTextRule

export type InternalRuleCollection = InternalRule[] | {
  [key in string | number]: InternalRule
}
