export const codeblock = {
  block: true,
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
}
