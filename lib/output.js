'use strict'

const { red, green, yellow, blue, bold } = require('colorette')

function success (message) {
  console.log(green(message))
}

function info (message) {
  let coloredMessage = message.replace('N|Solid', green('N|Solid'))
  coloredMessage = coloredMessage.replace('Executing', yellow('Executing'))
  coloredMessage = coloredMessage.replace('Extracting', yellow('Extracting'))
  coloredMessage = coloredMessage.replace('Killing', red('Killing'))

  if (message.includes('warning') || message.includes('Launching')) {
    coloredMessage = yellow(message)
  }

  console.log(coloredMessage)
}

function error (message) {
  console.error(bold(red(message)))
}

function debug (message) {
  const debug = process.env.DEBUG

  if (debug && (debug === '*' || debug === 'nsolid-exec')) {
    console.log(blue('nsolid-exec'), message)
  }
}

module.exports = {
  debug,
  info,
  success,
  error
}
