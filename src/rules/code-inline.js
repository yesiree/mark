module.exports.CodeInlineRule = {
  name: 'code-inline',
  inline: true,
  match: /^(`)([^`]*?)\1(?!`)/,
  tokenize: function (match) {
    const [full, _, code] = match
    this.length = full.length
    this.code = code
  },
  render() {
    return `<code>${this.code}</code>`
  }
}
