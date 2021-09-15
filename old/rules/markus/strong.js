module.exports.StrongRule = {
  name: 'strong',
  inline: true,
  match: /^(\*\*)([^*]*?)\1(?!\*\*)/,
  tokenize: function (match) {
    const [full, _, code] = match
    this.length = full.length
    this.code = code
  },
  render() {
    return `<strong>${this.code}</strong>`
  }
}
