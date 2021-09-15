const fs = require('fs')
const { Mark } = require('../dist/index')
const { ruleset } = require('../dist/rules/default')


const markdown = fs.readFileSync('./test/test.md').toString()
const mark = new Mark({ ruleset })
const html = mark.convert(markdown)
fs.writeFileSync('./.ignore/test.html', html)
