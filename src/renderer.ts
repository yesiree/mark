import { Options } from './interfaces/options.interface'
import { Token } from './interfaces/token.interface'


export function Renderer(opts: Options) {
  this.opts = opts
}

Renderer.prototype.render = function render(tokens: Token[]): string {
  return tokens
    .map(token => token.render())
    .join('')
}
