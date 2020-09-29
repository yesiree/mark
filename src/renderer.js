const Renderer = module.exports.Renderer = function Renderer(opts) {
  this.opts = opts
}

Renderer.prototype.render = function (tokens = []) {
  let out = ''
  let l = tokens.length
  for (let i = 0; i < l; i++) {
    out += tokens[i].render()
  }
  return out
}
