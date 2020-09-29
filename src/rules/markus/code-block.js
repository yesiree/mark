module.exports.CodeBlockRule = {
  name: 'code-block',
  inline: false,
  match: /^`{3}([^`\n]*)\n([\s\S]*?)\n`{3}(?:\n|$)/,
  tokenize: function (match) {
    const [full, language, code] = match
    this.length = full.length
    this.language = language
    this.code = code
  },
  render() {
    return `<pre lang="${this.language}"><code>${this.code}</code></pre>`
  }
}
