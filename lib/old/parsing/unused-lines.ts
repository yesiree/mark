import { UnusedLines } from '../common.interface'

export class ConcreteUnusedLines implements UnusedLines {
  lines: string[] = []
  get hasLines(): boolean {
    return this.lines.length > 0
  }
  push(line: string) {
    this.lines.push(line)
  }
  peek(): string[] {
    return this.lines
  }
  consume() {
    this.lines = []
  }
}
