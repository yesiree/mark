const { Mark } = require('../src/index')
const marked = require('marked')

const iterations = 500000
const markdown = `# Hello

When do you want it?

## Header 2

What do you want?

### Header 3

Now what?`


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
