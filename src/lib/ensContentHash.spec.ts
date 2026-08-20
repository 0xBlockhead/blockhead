import { describe, expect, it } from 'vitest'

import {
	decodeEnsContentHash,
	ensContentHashBrowseHref,
} from '$/lib/ensContentHash.ts'


describe('decodeEnsContentHash', () => {
	it('decodes representative content hashes and rejects empty values', () => {
		const encoded = 'e30101701220cc3ed40dc532b42b4907b5a22bb5648ab0ed412fd7304189410f5b5e30bc4fe4'
		const decoded = decodeEnsContentHash(encoded)
		expect(decoded).not.toBeNull()
		expect(decoded?.codec).toBe('ipfs')
		expect(decoded?.canonicalUri).toBe(
			'ipfs://bafybeigmh3ka3rjswqvusb5vuiv3kzekwdwucl6xgbaysqiplnpdbpcp4q'
		)
		expect(decodeEnsContentHash('0x')).toBeNull()
		expect(decodeEnsContentHash('0x0000')).toBeNull()
	})
})

describe('ensContentHashBrowseHref', () => {
	it('maps IPFS and Swarm identities to canonical browse routes', () => {
		const encoded = 'e30101701220cc3ed40dc532b42b4907b5a22bb5648ab0ed412fd7304189410f5b5e30bc4fe4'
		const href = ensContentHashBrowseHref(encoded)
		expect(href?.startsWith('/ipfs/')).toBe(true)

		const swarmHref = ensContentHashBrowseHref(
			'bzz://0000000000000000000000000000000000000000000000000000000000000001'
		)
		expect(swarmHref).toBe(
			'/swarm/0000000000000000000000000000000000000000000000000000000000000001'
		)

		expect(ensContentHashBrowseHref(
			'swarm://0000000000000000000000000000000000000000000000000000000000000001/docs/index.html'
			)).toBe(
			'/swarm/0000000000000000000000000000000000000000000000000000000000000001/path/docs/index.html'
		)
	})
})
