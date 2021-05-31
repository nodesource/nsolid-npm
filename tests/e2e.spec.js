'use strict'

const test = require('ava')
const { existsSync } = require('fs')
const { join } = require('path')
const { tmpdir, platform } = require('os')
const { spawnSync, execSync } = require('child_process')
const { deleteCommand } = require('../lib/multiplatform')
const processManager = require('../lib/process-manager')
const currentOS = platform()

test.serial.before(t => {
  execSync(deleteCommand(currentOS, join(tmpdir(), '.nsolid-runtime')))
  execSync(deleteCommand(currentOS, join(tmpdir(), 'nsolid-runtime.tar.gz')))
  execSync(deleteCommand(currentOS, join(tmpdir(), 'metadata-test.json')))
})

test.serial('runtime.js spec - download the runtime', t => {
  const downloadProcess = spawnSync(
    process.argv0,
    ['lib/runtime.js'],
    { encoding: 'utf-8', env: Object.assign({ DEBUG: 'nsolid-exec', NODE_ENV: 'test' }, process.env) }
  )

  t.log(`OUTPUT: ${downloadProcess.stdout} - ERROR: ${downloadProcess.stderr}`)
  t.is(downloadProcess.stderr, '', 'should download and extract the runtime without errors')
  t.is(existsSync(join(tmpdir(), '.nsolid-runtime', process.release.lts.toLowerCase())), true, 'runtime directory should exists')
})

test.serial('process-manager.js spec - launch processes', t => {
  processManager.start(process.release.lts.toLowerCase(), join(tmpdir(), '.nsolid-runtime'))

  processManager.launchProcess([join(__dirname, 'tests', 'fixtures', 'index.js')])
  t.is(processManager.nsolidProcesses.length, 1, 'should have 1 process running')

  processManager.launchProcess([join(__dirname, 'tests', 'fixtures', 'index.js')])
  t.is(processManager.nsolidProcesses.length, 2, 'should have 2 processes running')

  processManager.stopProcesses()
  t.is(processManager.nsolidProcesses.length, 0, 'should have 0 processes running')
})
