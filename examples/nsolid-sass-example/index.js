const { createServer } = require('http')
const { ok } = require('assert')
const packageJSON = require('./package.json')

// throws an error if you didn't provide a valid nsolid saas url
const validSaaSUrl = packageJSON?.nsolid?.saas?.includes('saas.nodesource.io')
ok(validSaaSUrl, "the N|Solid SaaS URL provided is invalid!")


createServer((request, response) => {
    response.end('Hello World')
}).listen(3000, _ => console.log('server running at 3000'))