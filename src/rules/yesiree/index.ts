import { blockquote } from './blockquote'
import { code } from './code'
import { codeblock } from './codeblock'
import { em } from './em'
import { heading } from './heading'
import { line } from './line'
import { link } from './link'
import { orderedList } from './ordered-list'
import { strong } from './strong'
import { unorderedList } from './unordered-list'

export const ruleset = [
  heading,
  blockquote,
  orderedList,
  unorderedList,
  codeblock,
  line,
  link,
  strong,
  em,
  code
]

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
