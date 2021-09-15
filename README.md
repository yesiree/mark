# mark

A modern markdown converter

## TODO
 - Implement more rules
 - Implement rulesets for specs like GFM and CommonMark
 - Setup build for esm2015 fesm2015, es5...etc.
 - Implement test suite, including tests against each spec (GFM, CommonMark, Markus, etc.)
 - Documentation
  - Including the detail that any rule must match the following interface:

```typescript
interface Token {
  length: number
}

interface Rule {
  match: RegExp | Function
  tokenize: function(result: any /* result of `match` */): Token // must be constructable (e.g. `tokenize() {}` wont' work, you must do `tokenize: function() {}`),
  render(): string
}
```


const test = ruleset.map(rule => {
  switch (rule.name) {
    case 'heading':
      rule = {
        ...rule,
        render(token) {
          const content = token
            .childTokens
            .map(x => x.render())
            .join('')
          return `<h${token.level}>${content}</h${token.level}>`
        }
      }
      break
  }
  return rule
})
