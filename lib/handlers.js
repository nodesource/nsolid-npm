'use strict'

const output = require('./output')
const processManager = require('./process-manager')

// Closing all processes before exit
function exitHandler () {
  output.debug('Closing all applications')
  processManager.stopProcesses()
  process.exit(0)
}

function unexpectedError (err) {
  output.error('There was an unexpected error')
  processManager.stopProcesses()
  output.debug(err)
  process.exit(1)
}

module.exports = {
  exitHandler,
  unexpectedError
}
