'use strict'

const test = require('ava')
const { spawnSync } = require('child_process')
const { existsSync, unlinkSync } = require('fs')
const { tmpdir } = require('os')
const { join } = require('path')

const metadata = join(tmpdir(), 'metadata.json')
const downloader = (url) => `
    const downloader = require('./lib/downloader');
    (async () => {
      await downloader('${url}', '${metadata}', true)
    })()
  `

test.before(t => {
  if (existsSync(metadata)) unlinkSync(metadata)
})

test('downloader.js spec - valid file', t => {
  const downloaderProcess = spawnSync(
    process.argv0,
    ['-e', downloader('https://nsolid-download.nodesource.com/download/metadata.json')],
    { encoding: 'utf-8' }
  )

  t.is(downloaderProcess.stdout.includes(`https://nsolid-download.nodesource.com/download/metadata.json downloaded to: ${tmpdir()}`), true, 'should show the download message')
  t.is(existsSync(metadata), true, 'downloaded file should exist')
})

test('downloader.js spec - 404', t => {
  const downloaderProcess = spawnSync(
    process.argv0,
    ['-e', downloader('https://werdydomain785431288.package/metadata-not-found.json')],
    { encoding: 'utf-8' }
  )

  t.is(downloaderProcess.stderr.includes('Error:'), true, 'should throw an error')
})
