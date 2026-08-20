import { describe, expect, it } from 'vitest'

import { parseSwarmManifest } from '$/sources/Swarm/Rest/queries.ts'

const reference = 'a'.repeat(64)

describe('Swarm manifest parser', () => {
	it('preserves Bee document metadata and native entry authority', () => {
		const manifest = {
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
		}

		expect(parseSwarmManifest(JSON.stringify(manifest))).toEqual(manifest)
	})

	it.each([
		['traversal', {
			manifest: { version: '0.1' },
			entries: [{ path: '../secret', hash: reference }],
		}, 'invalid manifest entry path'],
		['duplicate', {
			manifest: { version: '0.1' },
			entries: [
				{ path: 'a', hash: reference },
				{ path: 'a', hash: reference },
			],
		}, 'duplicate manifest entry path'],
		['non-native', {
			manifest: { version: '0.1' },
			entries: [{ path: 'a', hash: 'invalid' }],
		}, 'invalid manifest entry hash'],
	] as const)('fails closed on %s entries', (_case, manifest, message) => {
		expect(() => parseSwarmManifest(JSON.stringify(manifest))).toThrow(message)
	})

	it('fails closed on malformed JSON', () => {
		expect(() => parseSwarmManifest('{')).toThrow('invalid manifest JSON')
	})
})
