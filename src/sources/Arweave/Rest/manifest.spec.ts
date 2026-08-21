import {
	describe,
	expect,
	it,
} from 'vitest'

import { parseArweaveManifest } from '$/sources/Arweave/Rest/queries.ts'

const transactionId = 'A'.repeat(43)

describe('Arweave path manifest parser', () => {
	it('preserves v0.2 path-only index, fallback, and nested path authority', () => {
		const manifest = {
			manifest: 'arweave/paths',
			version: '0.2.0',
			index: { path: 'index.html' },
			fallback: { id: transactionId },
			paths: {
				'index.html': { id: transactionId },
				'assets/app.js': { id: transactionId },
			},
		}

		expect(parseArweaveManifest(JSON.stringify(manifest))).toEqual(manifest)
	})

	it('accepts a v0.2 id-only index and preserves id precedence data', () => {
		const indexId = 'B'.repeat(43)
		expect(parseArweaveManifest(JSON.stringify({
			manifest: 'arweave/paths',
			version: '0.2.0',
			index: { path: 'index.html', id: indexId },
			paths: { 'index.html': { id: transactionId } },
		})).index).toEqual({ path: 'index.html', id: indexId })
	})

	it.each([
		['traversal path', {
			manifest: 'arweave/paths',
			version: '0.1.0',
			paths: {
				'../secret': { id: transactionId },
			},
		}, undefined],
		['invalid target identity', {
			manifest: 'arweave/paths',
			version: '0.1.0',
			paths: {
				'index.html': { id: 'invalid' },
			},
		}, 'invalid manifest path index.html transaction ID'],
		['empty index', {
			manifest: 'arweave/paths',
			version: '0.2.0',
			index: {},
			paths: {},
		}, 'invalid manifest index'],
		['invalid index identity', {
			manifest: 'arweave/paths',
			version: '0.2.0',
			index: { id: 'invalid' },
			paths: {},
		}, 'invalid manifest index transaction ID'],
		['v0.1 id index', {
			manifest: 'arweave/paths',
			version: '0.1.0',
			index: { id: transactionId },
			paths: {},
		}, 'invalid manifest index for version 0.1.0'],
	] as const)('fails closed for %s', (_case, manifest, message) => {
		expect(() => parseArweaveManifest(JSON.stringify(manifest))).toThrow(message)
	})

	it('fails closed for malformed JSON', () => {
		expect(() => parseArweaveManifest('{')).toThrow('invalid manifest JSON')
	})
})
