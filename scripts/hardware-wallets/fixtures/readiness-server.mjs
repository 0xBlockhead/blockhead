import { createServer } from 'node:http'


const [mode, portValue] = process.argv.slice(2)

process.on('SIGTERM', () => process.exit(0))

if (mode === 'never-ready') {
	process.stderr.write('fixture-first-failure\n')
	setInterval(() => {}, 1_000)
} else {
	const server = createServer((_request, response) => {
		response.writeHead(200, { 'content-type': 'application/json' })
		response.end('{"ready":true}')
	})

	server.listen(Number(portValue), '127.0.0.1', () => {
		process.stdout.write('fixture-ready\n')
	})
}
