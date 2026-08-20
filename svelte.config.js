import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { relative, sep } from 'node:path'

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
		adapter: adapter(),

		alias: {
			'$': './src',
		},

		experimental: {
			remoteFunctions: true,
		},
	},
}
