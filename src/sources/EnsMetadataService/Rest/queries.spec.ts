import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/EnsMetadataService/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const queries = await import('$/sources/EnsMetadataService/Rest/queries.ts')
const {
	getAvatarMetadata,
	getEnsNftMetadata,
} = queries

const binding = bindings[Source.EnsMetadataService]

describe('ENS Labs Metadata Service OpenAPI operations', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('queries ENS NFT metadata through the official network, contract, and token route', async () => {
		getJson.mockResolvedValue({
			is_normalized: true,
			name: 'nick.eth',
			description: 'nick.eth, an ENS name.',
			attributes: [{
				trait_type: 'Length',
				display_type: 'number',
				value: 4,
			}],
			name_length: 4,
			url: 'https://app.ens.domains/name/nick.eth',
			version: 0,
			background_image: 'https://metadata.ens.domains/mainnet/avatar/nick.eth',
			image: 'https://metadata.ens.domains/mainnet/image',
			image_url: 'https://metadata.ens.domains/mainnet/image',
		})

		await expect(getEnsNftMetadata({
			networkName: 'mainnet',
			contractAddress: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
			tokenId: 'name/hash',
		})).resolves.toMatchObject({
			name: 'nick.eth',
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/name%2Fhash'
		)
	})

	it('queries avatar metadata without allowing the name to alter the route', async () => {
		getJson.mockResolvedValue({
			uri: 'eip155:1/erc721:0x0000000000000000000000000000000000000000/1',
			name: 'Avatar',
			description: 'ENS avatar',
			attributes: 'traits',
			image: 'ipfs://avatar',
		})

		await getAvatarMetadata({
			networkName: 'sepolia',
			name: 'name/with path.eth',
		})

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/sepolia/avatar/name%2Fwith%20path.eth/meta'
		)
	})

	it('exports only endpoint-specific operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getAvatarMetadata',
			'getEnsNftMetadata',
		])
	})
})
