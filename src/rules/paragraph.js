module.exports.ParagraphRule = {
  name: 'paragraph',
  inline: false,
  match: /^[^\n]+/,
  tokenize: function (match) {
    const [text] = match
    this.length = text.length
    this.text = text
    this.tokens = this.lexInline(text)
  },
  render() {
    const out = this.tokens.map(x => x.render()).join('')
    return `<p>${out}</p>`
  }
}
