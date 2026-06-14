#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

const arguments_ = process.argv.slice(2)
const target = arguments_.find((argument) => !argument.startsWith('--'))
const svelteVersion = (
	arguments_.find((argument, index) => (
		arguments_[index - 1] === '--svelte-version'
	)) ?? '5'
)

const config = existsSync('svelte.config.js') ?
	(await import(`${process.cwd()}/svelte.config.js`)).default
:
	undefined

const isAsync = (
	arguments_.includes('--async')
	|| config?.compilerOptions?.experimental?.async === true
)

if (target == null) {
	console.error('Usage: node scripts/svelte-autofix.mjs <file-or-code> [--svelte-version 5] [--async]')
	process.exitCode = 1
} else {
	const targetExists = existsSync(target)
	const fetchReal = globalThis.fetch

	globalThis.fetch = (input, init) => (
		String(input) === 'https://svelte.dev/docs/experimental/sections.json' ?
			Promise.resolve(new Response('{}', {
				headers: {
					'content-type': 'application/json',
				},
			}))
		:
			fetchReal(input, init)
	)

	const { svelteAutofixer } = await import('@sveltejs/mcp')
	const result = await svelteAutofixer({
		code: targetExists ? await readFile(target, 'utf8') : target,
		desired_svelte_version: svelteVersion,
		async: isAsync,
		filename: targetExists ? basename(target) : undefined,
	})

	console.log(JSON.stringify(result, null, '\t'))

	process.exit(result.issues.length > 0 ? 1 : 0)
}
