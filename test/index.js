const fs = require('fs')
const { join } = require('path')
const { Mark } = require('../dist/index')
const { ruleset } = require('../dist/rules/light')


const inputPath = join(__dirname, './test.md')
const outputPath = join(__dirname, './.ignore/test.html')

const markdown = fs.readFileSync(inputPath).toString()
const mark = new Mark({ ruleset })
const html = mark.convert(markdown)
fs.writeFileSync(outputPath, html)
