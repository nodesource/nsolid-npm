'use strict'

const { platform } = require('os')
const commandExists = require('command-exists').sync

const current = platform()
const method = commandExists('tar') && commandExists('gzip') ? 'tar' : 'npx'

function deleteCommand (path) {
  if (current === 'win32') return `IF EXIST ${path} rd ${path} /s /q`

  return `rm -rf ${path}`
}

function moveCommand (source, dest) {
  if (current === 'win32') return `move ${source}\\* ${dest}`

  return `mv ${source}/* ${dest}`
}

function extractCommand (source, dest) {
  if (method === 'tar') {
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
