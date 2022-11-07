export interface iLinkRef {
  label: string
  dest: string
  title: string
}

export class LinkRefCollection {
  // Regex for matching link reference definitions
  //
  //  Part 1 — The Label
  //  ^ {0,3}\[((?:[^\]\s]|\\\]){1,999})(?<!\\)\]:[^\S\n]*\n?[^\S\n]*
  //
  //  Part 2 — The Destination
  //  ((?![<\s])(?:\((?:[^)(\s]+|\((?:[^)(\s]+|\((?:[^)(\s]+|\([^)(\s]+\))*\))*\))*\)|\\\(|\\\)|[^()\s])+|<(?:(?:(?![<>]).|\\[<>])+)(?<!\\)>)
  //
  //  Part 3 — The Title
  //  (?:[^\S\n]*\n[^\S\n]*|[^\S\n]+)((?!\\)('|")((?:(?!\4).|\\\4|\n(?!\n))+)(?<!\\)\4|\(((?:(?!\)).|\\\)|\n(?!\n))+)(?<!\\)\))
  //
  //  This regex matches stuff like this...
  //
  //  [label]: </url> "title"
  //  [label]: (one(two(three(four)))) 'title'
  //  [label]: /path/file.ext (title)
  //
  //  See here: https://github.github.com/gfm/#link-reference-definition
  static linkRefRegExp = /^ {0,3}\[((?:[^\]\s]|\\\]){1,999})(?<!\\)\]:[^\S\n]*\n?[^\S\n]*((?![<\s])(?:\((?:[^)(\s]+|\((?:[^)(\s]+|\((?:[^)(\s]+|\([^)(\s]+\))*\))*\))*\)|\\\(|\\\)|[^()\s])+|<(?:(?:(?![<>]).|\\[<>])+)(?<!\\)>)(?:[^\S\n]*\n[^\S\n]*|[^\S\n]+)((?!\\)('|")((?:(?!\4).|\\\4|\n(?!\n))+)(?<!\\)\4|\(((?:(?!\)).|\\\)|\n(?!\n))+)(?<!\\)\))/

  private linkRefs: { [key: string]: iLinkRef } = {}

  get(label: string): iLinkRef {
    return this.linkRefs[label]
  }

  consumeLinkRef(line: string): boolean {
    const match = LinkRefCollection.linkRefRegExp.exec(line)
    if (!match) return false
    const [_, label, dest, _3, _4, quotedTitle, parentheticalTitle] = match
    const title = quotedTitle || parentheticalTitle
    this.linkRefs[label] = { label, dest, title }
    return true
  }
}
