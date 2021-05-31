'use strict'

const test = require('ava')
const { execSync } = require('child_process')

test('handlers.js spec - exitHandler()', t => {
  const exitProcess = execSync(
    `DEBUG=* ${process.argv0} -e "const { exitHandler } = require('./lib/handlers'); process.on('beforeExit', exitHandler); setTimeout(() => console.log('process will exit'), 1500);"`
  )

  t.is(exitProcess.toString().includes('Closing all applications'), true, 'exitHandler should manage the exit properly')
})

test('handlers.js spec - unexpectedError()', t => {
  t.throws(
    () =>
      execSync(
      `${process.argv0} -e "const { unexpectedError } = require('./lib/handlers'); process.on('uncaughtException', unexpectedError); setTimeout(() => {throw new Error('process will die')}, 1500);"`
      ),
    {
      instanceOf: Error,
      message: /There was an unexpected error/
    },
    'unexpectedError should manage the errors properly'
  )
})
