import { resolve } from 'node:path'
import { config } from 'dotenv'
import { generateApi } from 'swagger-typescript-api'

config({
	path: [resolve(process.cwd(), '.env'), resolve(process.cwd(), '.env.local')],
})

const backendUrl = process.env.VITE_BACKEND_URL

if (!backendUrl) {
	throw new Error('Backend URL not set!')
}

generateApi({
	url: `${backendUrl}/swagger/v1/swagger.json`,
	output: resolve(process.cwd(), 'src'),
})
