import { describe, expect, it } from 'vitest'

import {
	decodeEnsContentHash,
	ensContentHashBrowseHref,
} from '$/lib/ensContentHash.ts'


describe('decodeEnsContentHash', () => {
	it('decodes a known IPFS contenthash hex', () => {
		const encoded = 'e30101701220cc3ed40dc532b42b4907b5a22bb5648ab0ed412fd7304189410f5b5e30bc4fe4'
		const decoded = decodeEnsContentHash(encoded)
		expect(decoded).not.toBeNull()
		expect(decoded?.codec).toBe('ipfs')
		expect(decoded?.canonicalUri).toBe(
			'ipfs://bafybeigmh3ka3rjswqvusb5vuiv3kzekwdwucl6xgbaysqiplnpdbpcp4q',
		)
	})

	it('returns null for empty/zero hex', () => {
		expect(decodeEnsContentHash('0x')).toBeNull()
		expect(decodeEnsContentHash('0x0000')).toBeNull()
	})
})

describe('ensContentHashBrowseHref', () => {
	it('maps decoded ipfs URI to browse href', () => {
		const encoded = 'e30101701220cc3ed40dc532b42b4907b5a22bb5648ab0ed412fd7304189410f5b5e30bc4fe4'
		const href = ensContentHashBrowseHref(encoded)
		expect(href?.startsWith('/ipfs/')).toBe(true)
	})

	it('maps bzz URI to swarm resource href', () => {
		const href = ensContentHashBrowseHref(
			'bzz://0000000000000000000000000000000000000000000000000000000000000001',
		)
		expect(href).toBe(
			'/swarm/0000000000000000000000000000000000000000000000000000000000000001',
		)
	})
})
