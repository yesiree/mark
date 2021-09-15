module.exports.TextRule = {
  name: 'text',
  inline: true,
  match: /^[^\n*`]+/,
  tokenize: function (tokenizer, match) {
    const [text] = match
    this.length = text.length
    this.text = text
  },
  render(renderer) {
    return this.text
  }
}
