import {
	describe,
	expect,
	it,
} from 'vitest'

import { parseArweaveManifest } from '$/sources/Arweave/Rest/queries.ts'

const transactionId = 'A'.repeat(43)

describe('Arweave path manifest parser', () => {
	it('preserves versioned index, fallback, and path target authority', () => {
		expect(parseArweaveManifest(JSON.stringify({
			manifest: 'arweave/paths',
			version: '0.2.0',
			index: { path: 'index.html' },
			fallback: { id: transactionId },
			paths: {
				'index.html': { id: transactionId },
				'assets/app.js': { id: transactionId },
			},
		}))).toEqual({
			manifest: 'arweave/paths',
			version: '0.2.0',
			index: { path: 'index.html' },
			fallback: { id: transactionId },
			paths: {
				'index.html': { id: transactionId },
				'assets/app.js': { id: transactionId },
			},
		})
	})

	it('fails closed for malformed JSON, traversal paths, and invalid target identity', () => {
		expect(() => parseArweaveManifest('{')).toThrow('invalid manifest JSON')
		expect(() => parseArweaveManifest(JSON.stringify({
			manifest: 'arweave/paths',
			version: '0.1.0',
			paths: {
				'../secret': { id: transactionId },
			},
		}))).toThrow()
		expect(() => parseArweaveManifest(JSON.stringify({
			manifest: 'arweave/paths',
			version: '0.1.0',
			paths: {
				'index.html': { id: 'invalid' },
			},
		}))).toThrow('invalid manifest path index.html transaction ID')
	})
})
