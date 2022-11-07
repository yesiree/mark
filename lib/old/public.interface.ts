import { MatchResult, Token, UnusedLines } from './common.interface'

export interface AbstractRule {
  level: 'block' | 'inline',
  desc?: string
  parse(meta: any): Token
  render(token: Token): string
}

export interface ScanRule extends AbstractRule {
  scan(line: string, meta: any[], unused: UnusedLines): MatchResult
}

export interface PatternRule extends AbstractRule {
  pattern: RegExp
}

export interface FenceRule extends AbstractRule {
  opening: RegExp | ((source: string) => MatchResult)
  closing: RegExp | ((source: string, meta: any[]) => MatchResult)
}

export interface TagRule extends AbstractRule {
  tags: [string, string | undefined]
}

export type Rule = ScanRule | PatternRule | FenceRule | TagRule
export type RuleCollection = Rule[] | {
  [key in string | number]: Rule
}

export interface MarkConfig {
  rules: RuleCollection
}
