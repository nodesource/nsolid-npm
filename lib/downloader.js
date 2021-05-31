'use strict'

const { URL } = require('url')
const { green } = require('colorette')
const http = require('https')
const fs = require('fs')
const output = require('./output')

const TIMEOUT = 10000

function downloader (url, pathFile, printInfo = true) {
  const uri = new URL(url)
  const file = fs.createWriteStream(pathFile)

  return new Promise((resolve, reject) => {
    const request = http.get(uri.href).on('response', (res) => {
      const len = parseInt(res.headers['content-length'], 10)
      let downloaded = 0
      let percent = 0
      res
        .on('data', (chunk) => {
          file.write(chunk)
          downloaded += chunk.length
          percent = (100.0 * downloaded / len).toFixed(2)
          if (printInfo) process.stdout.write(`Downloading ${green(percent)}% - ${green((downloaded / 1048576).toFixed(2))} MB\r`)
        })
        .on('end', () => {
          file.end()
          if (printInfo) output.info(`${uri.href} downloaded to: ${pathFile}`)
          setTimeout(() => {
            resolve()
          }, 2000)
        })
    })
      .on('error', (err) => {
        reject(err)
      })
    request.setTimeout(TIMEOUT, () => {
      request.destroy()
      reject(new Error(`request timeout after ${TIMEOUT / 1000.0}s`))
    })
  })
}

module.exports = downloader
