import { Options } from './interfaces/options.interface'
import { Parser } from './parser'
import { Renderer } from './renderer'


export class Mark {
  private parser
  private renderer

  constructor(private opts: Options) {
    this.parser = new Parser(opts)
    this.renderer = new Renderer(opts)
  }

  convert(source: string): string {
    return this.renderer.render(
      this.parser.parse(source)
    )
  }
}
