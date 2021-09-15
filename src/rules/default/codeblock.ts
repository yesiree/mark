import { Token } from '../../interfaces/token.interface'

export const codeblock = {
  block: true,
  name: 'codeblock',
  match: /^\`\`\`([^\n]*)([\s\S]*)\n\`\`\`/,
  tokenize(match: RegExpExecArray) {
    const [_, language, code] = match
    return {
      language,
      code
    }
  },
  render(token: Token) {
    return `<pre><code language="${token.language}">${token.code}</code></pre>`
  }
}
