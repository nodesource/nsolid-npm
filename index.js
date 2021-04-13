#!/usr/bin/env node
'use strict'

const { homedir } = require('os')
const { join } = require('path')
const { exitHandler, unexpectedError } = require('./lib/handlers')

const processManager = require('./lib/process-manager')
const output = require('./lib/output')
const args = process.env.npm_lifecycle_script.split(' ')
args.shift()

// Registering error and exit handlers
process.on('beforeExit', exitHandler)
process.on('SIGINT', exitHandler)
process.on('uncaughtException', unexpectedError)
process.on('unhandledRejection', unexpectedError)

if (!process.release.lts) {
  output.error('nsolid-exec is compatible only with Node.js LTS versions')
  process.exit(1)
}

processManager.start(process.release.lts.toLowerCase(), join(homedir(), '.nsolid-runtime'))
processManager.launchProcess(args)
