/*

  Markus is the custom markdown spec built specifically for the Mark library.

*/

const { NewlineRule } = require('./newline')
const { CodeBlockRule } = require('./code-block')
const { HeadingRule } = require('./heading')
const { ParagraphRule } = require('./paragraph')
const { CodeInlineRule } = require('./code-inline')
const { StrongRule } = require('./strong.js')
const { EmphasisRule } = require('./emphasis')
const { TextRule } = require('./text')

module.exports.ruleset = [
  // Block
  NewlineRule,
  CodeBlockRule,
  HeadingRule,
  ParagraphRule,
  // Inline
  CodeInlineRule,
  StrongRule,
  EmphasisRule,
  TextRule
]
