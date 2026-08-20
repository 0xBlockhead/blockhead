import {
	describe,
	expect,
	it,
} from 'vitest'

import { parseArweaveManifest } from '$/sources/Arweave/Rest/queries.ts'

const transactionId = 'A'.repeat(43)

describe('Arweave path manifest parser', () => {
	it('preserves versioned index, fallback, and path target authority', () => {
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
	] as const)('fails closed for %s', (_case, manifest, message) => {
		expect(() => parseArweaveManifest(JSON.stringify(manifest))).toThrow(message)
	})

	it('fails closed for malformed JSON', () => {
		expect(() => parseArweaveManifest('{')).toThrow('invalid manifest JSON')
	})
})
