module.exports.ParagraphRule = {
  inline: false,
  match: /^[^\n]+/,
  tokenize: function (match) {
    const [text] = match
    this.length = text.length
    this.text = text
  },
  render(token) {
    return `<p>${this.text}</p>`
  }
}
