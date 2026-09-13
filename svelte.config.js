import adapterNetlify from '@sveltejs/adapter-netlify'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { readFileSync } from 'node:fs'
import { relative, sep } from 'node:path'

const productionSecurityHeaders = JSON.parse(readFileSync(
	new URL('./scripts/app/production-security-headers.json', import.meta.url),
	'utf8',
))
const productionCspDirectives = Object.fromEntries(
	productionSecurityHeaders['Content-Security-Policy']
		.split('; ')
		.map((entry) => {
			const [directive, ...sources] = entry.split(' ')
			return [directive, sources.map((source) => source.replace(/^'|'$/g, ''))]
		}),
)

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess({
		script: true,
	}),

	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'shift-i',
		},
	},

	compilerOptions: {
		// defaults to rune mode for the project, execept for `node_modules`. Can be removed in svelte 6.
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
		},

		experimental: {
			async: true,
		},
	},

	kit: {
		adapter: adapterNetlify(),

		csp: {
			mode: 'auto',
			directives: productionCspDirectives,
		},

		alias: {
			'$': './src',
		},

		experimental: {
			remoteFunctions: true,
		},
	},
}
