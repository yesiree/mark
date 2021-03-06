module.exports.EmphasisRule = {
  name: 'emphasis',
  inline: true,
  match: /^(\*)([^*]*?)\1(?!\*)/,
  tokenize: function (match) {
    const [full, _, code] = match
    this.length = full.length
    this.code = code
  },
  render() {
    return `<em>${this.code}</em>`
  }
}
