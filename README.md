# mark

A modern markdown converter

## Summary

Mark takes a simple, rule-centric design approach to parsing markdown. The main constructor function, `Mark`, takes as its only option an array of rules. It's single method, `convert`, takes a source string. Mark then processes the source string by looping through the rules looking for matches. There is a built-in rule to catch plain text whenever the array of rules fails to find a match.

The rules passed into Mark determine everything: how to match, how to tokenize, and how to render. A typical rule looks something like this:

```typescript
export const heading = {
  block: true,
  name: 'heading',
  match: /^(#{1,6})[^\S\n]+([^\n]*)(\n|$)/,
  tokenize(match: RegExpExecArray, parseInline: InlineParserFn) {
    const [_, level, content] = match
    return {
      level: level.length,
      slug: content
        .toLowerCase()
        .replace(/(^\W+|\W+$)/g, '')
        .replace(/\W+/g, '-'),
      childTokens: parseInline(content)
    }
  },
  render(token: Token) {
    return `<h${token.level} id="${token.slug}">${token.childTokens}</h${token.level}>`
  }
}
```

The Mark engine can take this rule and do everything it needs to process headings in markdown. Because of this, rules are easy to replace or modify. For example, lets say we do ***NOT*** want to include an `id` attribute on headings. We can import the existing ruleset, and modify it like so:

```typescript
import { ruleset } from '@yesiree/mark/rules/default'

const modifiedRuleset = {
  ...ruleset,
  heading: {
    ...ruleset.heading,
    render(token) {
      return `<h${token.level}>${token.childTokens}<h${token.level}>`
    }
  }
}

const mark1 = new Mark({ ruleset })
const html1 = mark1.convert('# Hello.')

const mark2 = new Mark({ ruleset: modifiedRuleset })
const html2 = mark2.convert('# Hello.')

console.dir({ html1, html2 })
```

How easy was that?



## TODO
 - Implement more rules
 - Implement rulesets for specs like GFM and CommonMark
 - Setup build for esm2015 fesm2015, es5...etc.
 - Implement test suite, including tests against each spec (GFM, CommonMark, Markus, etc.)
 - Documentation
  - Including the detail that any rule must match the following interface:
