module.exports.TextRule = {
  name: 'text',
  inline: true,
  match: /^[^\n*`]+/,
  tokenize: function (match) {
    const [text] = match
    this.length = text.length
    this.text = text
  },
  render() {
    return this.text
  }
}
