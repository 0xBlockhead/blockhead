import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EvmNftFormat,
	EvmNftStandard,
} from '$/constants/Evm.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getNft = vi.hoisted(() => vi.fn())
const openSeaChainForChainId = vi.hoisted(() => vi.fn((chainId: number) => {
	if (chainId === 1)
		return 'ethereum'
	throw new Error(`OpenSea_Rest: unsupported EIP-155 chain ${chainId}`)
}))
const requireOpenSeaCredential = vi.hoisted(() => vi.fn(() => 'secret'))

vi.mock('$/sources/OpenSea/Rest/queries.ts', () => ({
	getNft,
	openSeaChainForChainId,
	requireOpenSeaCredential,
}))

const { default: openSeaRest } = await import('$/resolvers/OpenSea-Rest.ts')

const contractAddress = '0x3333333333333333333333333333333333333333'
const tokenId = '900719925474099312345'
const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('OpenSea REST resolver module', () => {
	beforeEach(() => {
		getNft.mockReset()
		openSeaChainForChainId.mockClear()
		requireOpenSeaCredential.mockClear()
		getNft.mockResolvedValue({
			nft: {
				identifier: tokenId,
				collection: 'collection',
				contract: contractAddress,
				token_standard: 'erc721',
				name: 'NFT',
				description: 'Described',
				image_url: 'https://images.example/nft.png',
				metadata_url: 'ipfs://cid/metadata.json',
				opensea_url: 'https://opensea.io/item/1',
				updated_at: '2026-01-01T00:00:00.000Z',
				is_disabled: false,
				is_nsfw: false,
				traits: [],
				is_suspicious: false,
				creator: '0x1111111111111111111111111111111111111111',
				owners: [],
			},
		})
	})

	it('registers under OpenSea_Rest for EvmNft', () => {
		expect(openSeaRest.source).toBe(Source.OpenSea_Rest)
		expect(openSeaRest.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.EvmNft,
		])
	})

	it('projects OpenSea NFT metadata onto EvmNft schema fields', async () => {
		const resolver = openSeaRest.resolvers[0]
		const snapshot = await resolver.resolve.EvmContractTokenId.resolve({
			$contract: {
				$network: network,
				address: contractAddress,
			},
			tokenId,
		}, context)

		expect(resolver.projections.standard(snapshot)).toBe(EvmNftStandard.Erc721)
		expect(resolver.projections.format(snapshot)).toBe(EvmNftFormat.Generic)
		expect(resolver.projections.name(snapshot)).toBe('NFT')
		expect(resolver.projections.description(snapshot)).toBe('Described')
		expect(resolver.projections.image(snapshot)).toBe('https://images.example/nft.png')
		expect(resolver.projections.tokenUri(snapshot)).toBe('ipfs://cid/metadata.json')
		expect(resolver.projections.active(snapshot)).toBe(true)
		expect(getNft).toHaveBeenCalledWith({
			credential: 'secret',
			chain: 'ethereum',
			address: contractAddress,
			identifier: tokenId,
		})
	})

	it('rejects unsupported chains before transport', async () => {
		const resolver = openSeaRest.resolvers[0]
		await expect(resolver.resolve.EvmContractTokenId.resolve({
			$contract: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '999',
					},
				},
				address: contractAddress,
			},
			tokenId,
		}, context)).rejects.toThrow('unsupported EIP-155 chain 999')
		expect(getNft).not.toHaveBeenCalled()
	})

	it('rejects response contract or token mismatches', async () => {
		const resolver = openSeaRest.resolvers[0]
		getNft.mockResolvedValueOnce({
			nft: {
				identifier: 'other',
				collection: 'collection',
				contract: contractAddress,
				token_standard: 'erc721',
				opensea_url: 'https://opensea.io/item/1',
				updated_at: '2026-01-01T00:00:00.000Z',
				is_disabled: false,
				is_nsfw: false,
				traits: [],
				is_suspicious: false,
				creator: contractAddress,
				owners: [],
			},
		})

		await expect(resolver.resolve.EvmContractTokenId.resolve({
			$contract: {
				$network: network,
				address: contractAddress,
			},
			tokenId,
		}, context)).rejects.toThrow('token id mismatch')
	})
})
