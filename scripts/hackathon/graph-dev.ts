import { spawn } from 'node:child_process'


const apiKey = process.env[process.argv[2] ?? 'THEGRAPH_API_KEY']?.trim()
if (!apiKey)
	throw new Error('Graph development requires a configured server credential')

const child = spawn(process.execPath, [
	'node_modules/vite/bin/vite.js',
	'dev',
	...(process.argv.includes('--e2e') ? ['--config', 'tests/e2e/vite.config.ts'] : []),
	'--host', '127.0.0.1',
	'--port', '5296',
], {
	stdio: 'inherit',
	env: {
		PATH: process.env.PATH,
		HOME: process.env.HOME,
		TMPDIR: process.env.TMPDIR,
		THEGRAPH_API_KEY: apiKey,
		...(process.argv.includes('--e2e') && {
			VITE_BLOCKHEAD_E2E_PROBE: '1',
			BLOCKFROST_PROJECT_ID: 'e2e',
			PUBLIC_ALLIUM_API_KEY: 'e2e',
			PUBLIC_NEYNAR_API_KEY: 'e2e',
			PUBLIC_YOUTUBE_API_KEY: 'e2e',
			PUBLIC_LND_MACAROON_HEX: 'e2e',
		}),
	},
})
for (const signal of ['SIGINT', 'SIGTERM'] as const)
	process.on(signal, () => child.kill(signal))
child.on('error', (error) => {
	console.error(error.message)
	process.exitCode = 1
})
child.on('exit', (code) => { process.exitCode = code ?? 1 })
