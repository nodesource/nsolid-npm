'use strict'

function deleteCommand (platform, path) {
  if (platform === 'win32') return `IF EXIST ${path} rd ${path} /s /q`

  return `rm -rf ${path}`
}

function moveCommand (platform, source, dest) {
  if (platform === 'win32') return `move ${source}\\* ${dest}`

  return `mv ${source}/* ${dest}`
}

function extractCommand (command, source, dest) {
  if (command === 'tar') {
    const extractOptions = source.includes('.tar.gz') ? 'zxvf' : 'xvf'
    return `tar -${extractOptions} ${source} -C ${dest}`
  }

  const plugin = source.includes('.tar.gz') ? 'targz' : 'tar'
  return `npx decompress-cli --plugin=${plugin} --out-dir=${dest} ${source}`
}

module.exports = {
  deleteCommand,
  moveCommand,
  extractCommand
}
