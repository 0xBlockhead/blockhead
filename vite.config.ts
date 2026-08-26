import devtoolsJson from 'vite-plugin-devtools-json'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { sveltekit } from '@sveltejs/kit/vite'
import type {
	Plugin,
	ViteDevServer,
} from 'vite'

import { e2eProbeVitePlugin } from './tests/e2e/_e2eProbeVitePlugin.ts'
import {
	vitestClientExclude,
	vitestClientInclude,
	vitestServerExclude,
	vitestServerInclude,
} from './test-discovery.config.mjs'

const tanstackBrowserSqliteSrc = fileURLToPath(new URL(
	'node_modules/@tanstack/browser-db-sqlite-persistence/src/index.ts',
	import.meta.url
))

const generatorPublicationPlugin = (): Plugin => {
	let paused = false
	let server: ViteDevServer
	const watchedGeneratedPaths = [
		resolve(import.meta.dirname, 'src/routes'),
		resolve(import.meta.dirname, 'src/schema'),
		resolve(import.meta.dirname, 'src/sources'),
		resolve(import.meta.dirname, 'src/views'),
		resolve(import.meta.dirname, 'tests/e2e/_generatedRouteFixtureMetadata.ts'),
		resolve(import.meta.dirname, 'SOURCES.md'),
	]

	return {
		name: 'blockhead-generator-publication',
		configureServer(configuredServer) {
			server = configuredServer
			configuredServer.middlewares.use(async (request, response, next) => {
				if (request.method !== 'POST' || !request.url?.startsWith('/__blockhead-generator/')) {
					next()
					return
				}

				if (request.url === '/__blockhead-generator/pause') {
					if (!paused) {
						await server.watcher.unwatch(watchedGeneratedPaths)
						paused = true
					}
					response.statusCode = 204
					response.end()
					return
				}
				if (request.url === '/__blockhead-generator/resume') {
					if (paused) {
						server.watcher.add(watchedGeneratedPaths)
						paused = false
						server.ws.send({
							type: 'full-reload',
							path: '*',
						})
					}
					response.statusCode = 204
					response.end()
					return
				}

				response.statusCode = 404
				response.end()
			})
		},
	}
}

export default defineConfig({
	resolve: {
		alias: {
			'bun:ffi': resolve(import.meta.dirname, 'shims/bun-ffi.js'),
			'@tanstack/browser-db-sqlite-persistence': tanstackBrowserSqliteSrc,
		},
	},
	optimizeDeps: {
		exclude: ['@tanstack/browser-db-sqlite-persistence'],
		include: [
			'@tevm/voltaire/block',
			'@tevm/voltaire/provider',
		],
	},
	plugins: [
		generatorPublicationPlugin(),
		...(process.env.VITE_BLOCKHEAD_E2E_PROBE === '1' ? [e2eProbeVitePlugin()] : []),
		sveltekit(),
		devtoolsJson(),
	],
	server: {
		strictPort: true,
		watch: {
			ignored: [
				'**/.svelte-kit/generated/**',
			],
		},
	},
	ssr: {
		noExternal: [
			/^@tevm\/voltaire/,
			'@tanstack/browser-db-sqlite-persistence',
			'@tanstack/db-sqlite-persistence-core',
			'@journeyapps/wa-sqlite',
		],
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: vitestClientInclude,
					exclude: vitestClientExclude,
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: vitestServerInclude,
					exclude: vitestServerExclude,
				}
			}
		]
	}
})
