const { Lexer } = require('./lexer')
const { Renderer } = require('./renderer')
const { defaults } = require('./defaults')

/*

  tokenize requirements:
    - must include the following properties
      - length

*/


module.exports.Mark = function Mark(opts = {}) {
  opts = { ...defaults, ...opts }
  this.lexer = new Lexer(opts)
  this.renderer = new Renderer(opts)
}

Mark.prototype.convert = function (markdown) {
  return this.renderer.render(this.lexer.lex(markdown))
}
