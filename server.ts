import express from 'express'
import cors from 'cors'

import * as url from 'node:url'

const portNumber = 3030
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const webserver = express()
const path = `${__dirname}dist/`

// Create GET route to serve 'Hello World'
webserver.get('/load', (_request, response) => {
	const authenticated = true
	if (authenticated) {
		response.sendFile(`${path}index.html`)
	}
})

webserver
	.use(express.static(path))
	.use(cors())
	.listen(portNumber, () => {
		console.log(`\nExpress server is running on port ${portNumber}`)
	})
