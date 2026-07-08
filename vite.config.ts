import devtoolsJson from 'vite-plugin-devtools-json'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { sveltekit } from '@sveltejs/kit/vite'

const tanstackBrowserSqliteSrc = fileURLToPath(new URL(
	'node_modules/@tanstack/browser-db-sqlite-persistence/src/index.ts',
	import.meta.url
))

const satteriBrowserEntry = fileURLToPath(new URL(
	'node_modules/satteri/browser.js',
	import.meta.url
))

const referenceFolderTestExcludes = [
	'src/schema_/**',
	'src/views_/**',
	'src/views__/**',
	'src/routes_/**',
	'src/sources_/**',
	'src/resolvers_/**',
] as const

export default defineConfig({
	resolve: {
		alias: {
			'$': resolve(import.meta.dirname, 'src'),
			'bun:ffi': resolve(import.meta.dirname, 'shims/bun-ffi.js'),
			'@tanstack/browser-db-sqlite-persistence': tanstackBrowserSqliteSrc,
			'satteri-browser': satteriBrowserEntry,
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
						...referenceFolderTestExcludes,
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
						...referenceFolderTestExcludes,
					]
				}
			}
		]
	}
})
