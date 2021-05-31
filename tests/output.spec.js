'use strict'

const test = require('ava')
const { execSync, spawnSync } = require('child_process')

test('output.js spec - success()', t => {
  const message = 'this is done'
  const successProcess = execSync(
    `${process.argv0} -e "const { success } = require('./lib/output'); success('${message}')"`,
    { encoding: 'utf-8' }
  )

  t.is(successProcess.includes(message), true, 'success output should print properly')
})

test('output.js spec - info()', t => {
  const message = 'Launching and Executing the Console'
  const infoProcess = execSync(
    `${process.argv0} -e "const { info } = require('./lib/output'); info('${message}')"`,
    { encoding: 'utf-8' }
  )

  t.is(infoProcess.includes(message), true, 'info output should print properly')
})

test('output.js spec - error()', t => {
  const message = 'There was an error'
  const errorProcess = spawnSync(
    process.argv0,
    ['-e', `const { error } = require('./lib/output'); error('${message}')`],
    { encoding: 'utf-8' }
  )

  t.is(errorProcess.stderr.includes(message), true, 'error output should print in stderr')
  t.not(errorProcess.stdout.includes(message), true, 'error output should not print in stdout')
})

test('output.js spec - debug()', t => {
  const message = 'Debug information'
  const normalProcess = spawnSync(
    process.argv0,
    ['-e', `const { debug } = require('./lib/output'); debug('${message}')`],
    { encoding: 'utf-8' }
  )

  t.not(normalProcess.stdout.includes(message), true, 'debug output should not print without the env variable')

  const debugProcess = spawnSync(
    process.argv0,
    ['-e', `const { debug } = require('./lib/output'); debug('${message}')`],
    { encoding: 'utf-8', env: Object.assign({}, process.env, { DEBUG: '*' }) }
  )

  t.is(debugProcess.stdout.includes(message), true, 'debug output should print with the env variable')
})
