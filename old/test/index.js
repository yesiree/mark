const { Mark } = require('../../src/index')
const marked = require('marked')

const iterations = 500000
const markdown = `# Hello

This sentence is \`technical\` in nature.

## Header 2

This is a very **bold** sentence.

### Header 3

This sentence as *emphasis* for dramatic effect

\`\`\`javascript
const foo = 'bar'
console.log(foo)
\`\`\`

This is **advanced** stuff.
`

function getMarkResults() {
  const mark = new Mark()
  const result = mark.convert(markdown)
  console.log(result)
}

function testMark() {
  const time = process.hrtime()
  const mark = new Mark()
  let result = '{/}'
  for (let i = 0; i < iterations; i++) {
    result = mark.convert(markdown)
  }
  const [s, ns] = process.hrtime(time)
  console.log(`\n     Mark: completed ${iterations} iterations in ${s + (ns / 1e9)}`)

}

function testMarked() {
  const time = process.hrtime()
  let result = '{/}'
  for (let i = 0; i < iterations; i++) {
    result = marked(markdown)
  }
  const [s, ns] = process.hrtime(time)
  console.log(`   Marked: completed ${iterations} iterations in ${s + (ns / 1e9)}\n\n`)
}

testMark()

testMarked()

getMarkResults()
