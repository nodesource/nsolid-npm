const { createServer } = require('http')

createServer((request, response) => {
    response.end('Hello World')
}).listen(3000, _ => console.log('server running at 3000'))