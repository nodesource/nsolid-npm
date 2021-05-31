'use strict'

const test = require('ava')
const { join } = require('path')
const { spawnSync } = require('child_process')

test('connection-checker.js spec - no config', t => {
  const connectionProcess = spawnSync(
    process.argv0,
    ['lib/connection-checker.js'],
    { encoding: 'utf-8' }
  )

  const error = 'The process is lacking the configuration to use N|Solid, please follow the instructions to configure it'
  t.is(connectionProcess.stderr.includes(error), true, 'should show the config error message')
})

test('connection-checker.js spec - NSOLID_COMMAND error connecting', t => {
  const connectionProcess = spawnSync(
    process.argv0,
    ['lib/connection-checker.js'],
    { encoding: 'utf-8', env: { NSOLID_COMMAND: 'localhost:9001', PWD: join(process.cwd(), 'tests', 'fixtures') } }
  )

  const error = 'There was a problem connecting to the N|Solid Console'
  t.is(connectionProcess.stderr.includes(error), true, 'should show the connection error message')
})

test('connection-checker.js spec - SaaS config in package.json error connecting', t => {
  const connectionProcess = spawnSync(
    process.argv0,
    ['lib/connection-checker.js'],
    { encoding: 'utf-8', env: { PWD: join(process.cwd(), 'tests', 'fixtures') } }
  )

  const error = 'There was a problem connecting to the N|Solid Console'
  const saasUrl = '55da80ae-798b-4351-fake-71193eaab9db.dumby.saas.nodesource.io'
  t.is(connectionProcess.stderr.includes(error), true, 'should show the connection error message')
  t.is(connectionProcess.stderr.includes(saasUrl), true, 'should show the parsed SaaS URL')
})

test('connection-checker.js spec - NSOLID_SAAS connecting', t => {
  const connectionProcess = spawnSync(
    process.argv0,
    ['lib/connection-checker.js'],
    {
      encoding: 'utf-8',
      env: {
        NSOLID_SAAS: 'ebSqy3om-Az)w]XM5CvamkU*{?RLg}K/e41%knzp55da80ae-798b-4351-fake-71193eaab9db.proxy.saas.nodesource.io:30112',
        PWD: join(process.cwd(), 'tests', 'fixtures')
      }
    }
  )

  t.is(connectionProcess.stderr, '', 'should not be an error message')
})
