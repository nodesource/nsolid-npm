'use strict'

const test = require('ava')
const { tmpdir } = require('os')
const { join } = require('path')
const joinWin32 = require('path').win32.join
const { deleteCommand, moveCommand, extractCommand } = require('../lib/multiplatform')
const tmpWin32 = 'C:\\tmp'

test('multiplatform.js spec - deleteCommand win32', t => {
  const tmp = joinWin32(tmpWin32, 'nsolid-win32')
  const command = deleteCommand('win32', tmp)
  t.is(command, `IF EXIST ${tmp} rd ${tmp} /s /q`)
})

test('multiplatform.js spec - deleteCommand linux', t => {
  const tmp = join(tmpdir(), 'nsolid-linux')
  const command = deleteCommand('linux', tmp)
  t.is(command, `rm -rf ${tmp}`)
})

test('multiplatform.js spec - moveCommand win32', t => {
  const src = joinWin32(tmpWin32, 'nsolid-win32')
  const dest = joinWin32(tmpWin32, 'nsolid-final')
  const command = moveCommand('win32', src, dest)
  t.is(command, `move ${joinWin32(src, '*')} ${dest}`)
})

test('multiplatform.js spec - moveCommand linux', t => {
  const src = join(tmpdir(), 'nsolid-linux')
  const dest = join(tmpdir(), 'nsolid-final')
  const command = moveCommand('linux', src, dest)
  t.is(command, `mv ${join(src, '*')} ${dest}`)
})

test('multiplatform.js spec - extractCommand tar.gz', t => {
  const src = join(tmpdir(), 'nsolid.tar.gz')
  const dest = join(tmpdir(), 'nsolid')
  const command = extractCommand('tar', src, dest)
  t.is(command, `tar -zxvf ${src} -C ${dest}`)
})

test('multiplatform.js spec - extractCommand tar', t => {
  const src = join(tmpdir(), 'nsolid.tar')
  const dest = join(tmpdir(), 'nsolid')
  const command = extractCommand('tar', src, dest)
  t.is(command, `tar -xvf ${src} -C ${dest}`)
})

test('multiplatform.js spec - extractCommand npx tar.gz', t => {
  const src = join(tmpdir(), 'nsolid.tar.gz')
  const dest = join(tmpdir(), 'nsolid')
  const command = extractCommand('npx', src, dest)
  t.is(command, `npx decompress-cli --plugin=targz --out-dir=${dest} ${src}`)
})

test('multiplatform.js spec - extractCommand npx tar', t => {
  const src = join(tmpdir(), 'nsolid.tar')
  const dest = join(tmpdir(), 'nsolid')
  const command = extractCommand('npx', src, dest)
  t.is(command, `npx decompress-cli --plugin=tar --out-dir=${dest} ${src}`)
})
