import { Parser } from './parser'
import { Renderer } from './renderer'


export function Mark(opts) {
  this.opts = opts
  this.parser = new Parser(opts)
  this.renderer = new Renderer(opts)
}

Mark.prototype.convert = function (source): string {
  return this.renderer.render(
    this.parser.parse(source)
  )
}
