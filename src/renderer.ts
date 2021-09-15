import { Options } from './interfaces/options.interface'
import { Token } from './interfaces/token.interface'


export class Renderer {

  constructor(private opts: Options) { }

  render(tokens: Token[]): string {
    return tokens.map(x => x.render()).join('')
  }
}
