import { describe, expect, it } from 'vitest'

import { entityHrefFromSearchInput, evmAccountCandidatesFromSearchInput } from './entitySearch.ts'


describe(entityHrefFromSearchInput, () => {
	it.each([
		['eip155:1', '/network/eip155:1'],
		['eip155:1:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', '/account/eip155:1/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
		['https://example.com/a?b=c', '/url/https%3A%2F%2Fexample.com%2Fa%3Fb%3Dc'],
		['vitalik.eth', '/ens/name/vitalik.eth'],
		['ipfs://bafybeigdyrzt5sfp7udm7hu76f7lz4gf5o7vsvixd3rqfwxq6c6azp7j7m/folder/file.json', '/ipfs/ipfs/bafybeigdyrzt5sfp7udm7hu76f7lz4gf5o7vsvixd3rqfwxq6c6azp7j7m/path/folder/file.json'],
		['ipns://docs.ipfs.tech/concepts', '/ipfs/ipns/docs.ipfs.tech/path/concepts'],
		['magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567', '/magnet/magnet%3A%3Fxt%3Durn%3Abtih%3A0123456789abcdef0123456789abcdef01234567'],
	])('recognizes %s', (query, href) => {
		expect(entityHrefFromSearchInput(query)).toBe(href)
	})

	it('does not guess the network for a bare address', () => {
		expect(entityHrefFromSearchInput('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBeUndefined()
	})
})


describe(evmAccountCandidatesFromSearchInput, () => {
	it('offers checked-in EVM networks for a bare address', () => {
		const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
		const candidates = evmAccountCandidatesFromSearchInput(address)

		expect(candidates).toContainEqual({
			name: 'Ethereum Mainnet',
			caip2: 'eip155:1',
			namespace: 'eip155',
			reference: '1',
			accountAddress: address,
		})
		expect(candidates).toContainEqual({
			name: 'Base',
			caip2: 'eip155:8453',
			namespace: 'eip155',
			reference: '8453',
			accountAddress: address,
		})
	})

	it('does not offer EVM networks for other unresolved input', () => {
		expect(evmAccountCandidatesFromSearchInput('0123456789abcdef')).toEqual([])
	})
})
