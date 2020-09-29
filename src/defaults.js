const { HeadingRule } = require('./rules/heading')
const { NewlineRule } = require('./rules/newline')
const { ParagraphRule } = require('./rules/paragraph')

const defaults = {
  ruleset: [
    HeadingRule,
    NewlineRule,
    ParagraphRule
  ]
}

module.exports.defaults = defaults
