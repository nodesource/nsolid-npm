#!/usr/bin/env node
'use strict'

const { bold } = require('colorette')
const { execSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const commandExists = require('command-exists').sync

const { deleteCommand, moveCommand, extractCommand } = require('./multiplatform')
const output = require('./output')
const downloader = require('./downloader')

const method = commandExists('tar') && commandExists('gzip') ? 'tar' : 'npx'
const platform = os.platform()
const homedir = process.env.NODE_ENV !== 'test' ? os.homedir() : os.tmpdir()

if (!process.release.lts) {
  output.error('nsolid-exec is compatible only with Node.js LTS versions')
  process.exit(1)
}

const runtimePath = path.join(homedir, '.nsolid-runtime', process.release.lts.toLowerCase())

// Check if N|Solid runtime already exists
async function checkRuntime (lts) {
  const tarUrl = await checkVersion(lts)
  // @TODO also check the binary existence and if it works
  if (!fs.existsSync(runtimePath)) await downloadRuntime(tarUrl)
}

// Download available versions to get the last one and validate if one was specified
async function checkVersion (lts) {
  const versionsPath = path.join(os.tmpdir(), process.env.NODE_ENV !== 'test' ? 'metadata.json' : 'metadata-test.json')
  const support = ['darwin', 'linux', 'win32']
  const platform = os.platform()
  const arch = os.arch()

  let artifactVersion = platform
  if (platform === 'linux' && arch !== 'x64') artifactVersion = `${platform}-${arch}`

  let version
  let tarUrl

  if (!support.includes(platform)) {
    output.error('Your platform is not supported, just Windows, Linux and Mac are currently available')
    process.exit(1)
  }

  try {
    output.info('Checking N|Solid versions metadata')
    await downloader('https://nsolid-download.nodesource.com/download/metadata.json', versionsPath, false)
    const availableVersions = require(versionsPath)

    // Search for the newest N|Solid version containing the desired Node.js LTS version
    for (const key in availableVersions) {
      if (availableVersions[key].artifacts[artifactVersion] && availableVersions[key].artifacts[artifactVersion][`nsolid-${lts}`]) {
        version = key
        tarUrl = availableVersions[key].artifacts[artifactVersion][`nsolid-${lts}`]
        break
      }
    }

    if (!version) {
      output.error(`The desired Node.js LTS ${bold(lts)} is not currently supported in any N|Solid release`)
      process.exit(1)
    }
  } catch (error) {
    output.error('There was a problem validating the N|Solid version')
    output.debug(error)
    process.exit(1)
  }

  return tarUrl
}

// Download a specified runtime
async function downloadRuntime (tarUrl) {
  const tarPath = path.join(os.tmpdir(), 'nsolid-runtime.tar.gz')
  const runtimeDir = path.parse(tarUrl).name.replace('.tar', '').replace('alpine', 'linux')

  try {
    // Downloading the runtime
    output.info(`Downloading N|Solid Runtime from: ${tarUrl}`)
    await downloader(tarUrl, tarPath)
    extractRuntime(tarPath, runtimePath, runtimeDir)
  } catch (error) {
    output.error('There was an error downloading and extracting N|Solid Runtime')
    output.debug(error)
    process.exit(1)
  }
}

// Extract a runtime to the final directory
function extractRuntime (tarPath, runtimePath, runtimeDir) {
  output.info(`Extracting ${tarPath}`)
  fs.mkdirSync(runtimePath, { recursive: true })

  // Clean the directories to be used
  output.debug(deleteCommand(platform, path.join(os.tmpdir(), runtimeDir)))
  execSync(deleteCommand(platform, path.join(os.tmpdir(), runtimeDir)))

  // Extract the tar
  output.debug(extractCommand(method, tarPath, os.tmpdir()))
  execSync(extractCommand(method, tarPath, os.tmpdir()))

  // Move the files to the final destination
  output.debug(moveCommand(platform, path.join(os.tmpdir(), runtimeDir), runtimePath))
  execSync(moveCommand(platform, path.join(os.tmpdir(), runtimeDir), runtimePath))

  // Clean the tmp path and the tar
  output.debug(deleteCommand(platform, path.join(os.tmpdir(), runtimeDir)))
  execSync(deleteCommand(platform, path.join(os.tmpdir(), runtimeDir)))
  output.debug(deleteCommand(platform, tarPath))
  execSync(deleteCommand(platform, tarPath))
}

checkRuntime(process.release.lts.toLowerCase())
