'use strict'

const http = require('http')
const server = http.createServer((req, res) => res.end('Hello, World!\n'))
server.on('listening', () => console.log(`Listening on ${server.address().port}`))
server.listen()
