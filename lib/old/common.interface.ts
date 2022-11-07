export interface MatchResult {
  match: boolean
  length?: number
  meta?: any
}

export interface Token {
  meta: any
  inline?: string
  // children: Token[]
}

export interface UnusedLines {
  lines: string[]
  get hasLines(): boolean
  push(line: string): void
  peek(): string[]
  consume(): void
}
