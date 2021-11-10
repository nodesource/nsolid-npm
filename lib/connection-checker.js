'use strict'

const { join } = require('path')
const { existsSync } = require('fs')
const { createConnection } = require('net')
const output = require('./output')

// Try to establish a socket connection to test if the instance is able to connect to the configured Console
function checkConnection () {
  const connection = checkParameters()
  const connectionError = () => output.error(`There was a problem connecting to the N|Solid Console ${connection.host} ` +
    `using the port ${connection.port}, check if the Console is online or if the connection ` +
    'has a firewall blocking the connection')

  const client = createConnection(connection, () => {
    client.end()
    process.exit(0)
  })

  client.setTimeout(3000)

  client.on('timeout', err => {
    output.debug(`Timeout checking the connection - error: ${err}`)
    connectionError()
    client.destroy()
    process.exit(1)
  })

  client.on('error', err => {
    output.debug(`Error checking the connection - error: ${err}`)
    connectionError()
    process.exit(1)
  })
}

// Check the multiple ways to configure the process to connect to a Console and return a connection object
function checkParameters () {
  const packageJSONPath = join(process.env.PWD, 'package.json')
  const packageJSONExists = existsSync(packageJSONPath)
  const pkg = packageJSONExists ? require(packageJSONPath) : {}

  let connection = process.env.NSOLID_COMMAND || parseSaas(process.env.NSOLID_SAAS) ||
    ((pkg.nsolid && pkg.nsolid.command) ? pkg.nsolid.command : ((pkg.nsolid && pkg.nsolid.saas) ? parseSaas(pkg.nsolid.saas) : null))

  if (!connection) {
    output.error('The process is lacking the configuration to use N|Solid, please follow the instructions to configure it - https://docs.nodesource.com/nsolid/4.5/docs#nsolid-runtime')
    process.exit(1)
  }

  // In case the host was not provided
  if (!connection.includes(':')) {
    connection = `localhost:${connection}`
  }

  const connectionParts = connection.split(':', 2)
  return { host: connectionParts[0], port: connectionParts[1] }
}

// Parse the SaaS connection parameter
function parseSaas (token, offset = 0) {
  try {
    const saasUrl = token.slice(40, token.length)
    return saasUrl
  } catch {
    return null
  }
}

checkConnection()
