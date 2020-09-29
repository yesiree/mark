module.exports.NewlineRule = {
  inline: false,
  match: /^\n+/,
  tokenize: function (match) {
    this.length = match[0].length
  },
  render(token) {
    return ''
  }
}
