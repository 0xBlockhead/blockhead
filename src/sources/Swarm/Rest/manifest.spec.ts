import { describe, expect, it } from 'vitest'

import { parseSwarmManifest } from '$/sources/Swarm/Rest/queries.ts'

const reference = 'a'.repeat(64)

describe('Swarm manifest parser', () => {
	it('preserves Bee document metadata and native entry authority', () => {
		expect(parseSwarmManifest(JSON.stringify({
			manifest: {
				version: '0.2',
				indexDocument: 'index.html',
				errorDocument: '404.html',
			},
			entries: [{
				path: 'index.html',
				hash: reference,
				contentType: 'text/html',
				size: 12,
			}],
		}))).toEqual({
			manifest: {
				version: '0.2',
				indexDocument: 'index.html',
				errorDocument: '404.html',
			},
			entries: [{
				path: 'index.html',
				hash: reference,
				contentType: 'text/html',
				size: 12,
			}],
		})
	})

	it('fails closed on malformed, traversal, duplicate, and non-native entries', () => {
		expect(() => parseSwarmManifest('{')).toThrow('invalid manifest JSON')
		expect(() => parseSwarmManifest(JSON.stringify({
			manifest: { version: '0.1' },
			entries: [{ path: '../secret', hash: reference }],
		}))).toThrow('invalid manifest entry path')
		expect(() => parseSwarmManifest(JSON.stringify({
			manifest: { version: '0.1' },
			entries: [
				{ path: 'a', hash: reference },
				{ path: 'a', hash: reference },
			],
		}))).toThrow('duplicate manifest entry path')
		expect(() => parseSwarmManifest(JSON.stringify({
			manifest: { version: '0.1' },
			entries: [{ path: 'a', hash: 'invalid' }],
		}))).toThrow('invalid manifest entry hash')
	})
})
