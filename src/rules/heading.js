module.exports.HeadingRule = {
  inline: false,
  match: /^[^\S\r\n]*(#{1,6})[^\S\r\n]+([^\n]+)/,
  tokenize: function (match) {
    const [full, level, text] = match
    this.length = full.length
    this.level = level.length
    this.text = text
  },
  render(token) {
    return `<h${this.level}>${this.text}</h${this.level}>`
  }
}
