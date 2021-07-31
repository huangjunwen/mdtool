// https://stackoverflow.com/a/63361543/157235
async function getStream (s) {
  let chunks = []
  for await (let chunk of s) {
    chunks.push(chunk)
  }
  const buffer = Buffer.concat(chunks)
  return buffer.toString('utf-8')
}

module.exports = getStream
