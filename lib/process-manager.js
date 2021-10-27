'use strict'

const { spawn } = require('child_process')
const { existsSync } = require('fs')
const { join } = require('path')
const { platform } = require('os')
const output = require('./output')

class ProcessManager {
  constructor () {
    this.nsolidProcesses = []
  }

  // Check and configure the binary path to be used
  start (lts, runtimePath) {
    this.runtimePath = runtimePath
    this.binaryPath = platform() === 'win32'
      ? join(this.runtimePath, lts, 'nsolid.exe')
      : join(this.runtimePath, lts, 'bin', 'nsolid')

    if (!existsSync(this.binaryPath)) {
      output.error(`The N|Solid runtime ${this.binaryPath} is missing, aborting the execution`)
      process.exit(1)
    }
  }

  // Launch the user's task with NSolid
  launchProcess (args) {
    // In case the arg is just the 'nsolid' command without running an app
    if (args[args.length - 1] === 'nsolid') args = []
    const nsolidProcess = spawn(this.binaryPath, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: process.env
    })

    this.nsolidProcesses.push(nsolidProcess)
  }

  // Stop all processes running
  stopProcesses () {
    for (let i = 0; i < this.nsolidProcesses.length; i++) {
      output.debug(`Killing the process: ${this.nsolidProcesses[i].pid}`)
      this.nsolidProcesses[i].kill('SIGINT')
      this.nsolidProcesses[i].kill()
    }

    this.nsolidProcesses = []
  }
}

module.exports = new ProcessManager()
