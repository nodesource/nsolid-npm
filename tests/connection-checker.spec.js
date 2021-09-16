'use strict'

const net = require('net')
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
    { encoding: 'utf-8', env: { NSOLID_COMMAND: 'localhost:9090', PWD: join(process.cwd(), 'tests', 'fixtures') } }
  )

  const error = 'There was a problem connecting to the N|Solid Console'
  t.is(connectionProcess.stderr.includes(error), true, 'should show the connection error message')
})

test.cb('connection-checker.js spec - NSOLID_COMMAND successfully connecting', t => {
  const server = net.createServer()

  server.on('connection', (socket) => {
    socket.write('OK \r\n')
    socket.on('error', (err) => {
      t.log(`Error: ${err}`)
    })
  })

  server.listen(9090, '127.0.0.1', () => {
    const connectionProcess = spawnSync(
      process.argv0,
      ['lib/connection-checker.js'],
      {
        encoding: 'utf-8',
        env: {
          NSOLID_COMMAND: '127.0.0.1:9090',
          PWD: join(process.cwd(), 'tests', 'fixtures')
        }
      }
    )

    t.is(connectionProcess.stderr, '', 'should not be an error message')
    t.end()
  })
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
