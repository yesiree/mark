const { NewlineRule } = require('./rules/newline')
const { CodeBlockRule } = require('./rules/code-block')
const { HeadingRule } = require('./rules/heading')
const { ParagraphRule } = require('./rules/paragraph')
const { CodeInlineRule } = require('./rules/code-inline')
const { StrongRule } = require('./rules/strong.js')
const { EmphasisRule } = require('./rules/emphasis')
const { TextRule } = require('./rules/text')

const defaults = {
  ruleset: [
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
}

module.exports.defaults = defaults
