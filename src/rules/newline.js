module.exports.NewlineRule = {
  name: 'newline',
  inline: false,
  match: /^\n+/,
  tokenize: function (match) {
    this.length = match[0].length
  },
  render() {
    return ''
  }
}
