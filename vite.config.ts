import devtoolsJson from 'vite-plugin-devtools-json'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { sveltekit } from '@sveltejs/kit/vite'

/**
 * Prebuilt `@tanstack/browser-db-sqlite-persistence` ships a worker wrapper with a
 * Node-flavored default export shape under Vite. Alias to source so Vite bundles the
 * OPFS worker consistently for browser tests and the app.
 */
const tanstackBrowserSqliteSrc = fileURLToPath(new URL(
	'node_modules/@tanstack/browser-db-sqlite-persistence/src/index.ts',
	import.meta.url
))

export default defineConfig({
	resolve: {
		alias: {
			'bun:ffi': resolve(import.meta.dirname, 'shims/bun-ffi.js'),
			'@tanstack/browser-db-sqlite-persistence': tanstackBrowserSqliteSrc,
		},
	},
	optimizeDeps: {
		exclude: ['@tanstack/browser-db-sqlite-persistence'],
	},
	plugins: [sveltekit(), devtoolsJson()],
	server: {
		strictPort: true,
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
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: [
						'src/lib/server/**',
						'src/routes/demo/**',
					]
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: [
						'src/**/*.svelte.{test,spec}.{js,ts}',
						'src/routes/demo/**',
					]
				}
			}
		]
	}
})
