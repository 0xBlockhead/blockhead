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
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getAccountNfts = vi.hoisted(() => vi.fn())
const getNft = vi.hoisted(() => vi.fn())
const getNftsByContract = vi.hoisted(() => vi.fn())
const openSeaChainForChainId = vi.hoisted(() => vi.fn((chainId: number) => {
	if (chainId === 1)
		return 'ethereum'
	throw new Error(`OpenSea_Rest: unsupported EIP-155 chain ${chainId}`)
}))

vi.mock('$/sources/OpenSea/Rest/queries.ts', () => ({
	getAccountNfts,
	getNft,
	getNftsByContract,
	openSeaChainForChainId,
}))

const { default: openSeaRest } = await import('$/resolvers/OpenSea-Rest.ts')

const accountAddress = '0x1111111111111111111111111111111111111111'
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

const listNft = {
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
}

describe('OpenSea REST resolver module', () => {
	beforeEach(() => {
		getAccountNfts.mockReset()
		getNft.mockReset()
		getNftsByContract.mockReset()
		openSeaChainForChainId.mockClear()
		getNft.mockResolvedValue({
			nft: {
				...listNft,
				is_suspicious: false,
				creator: accountAddress,
				owners: [],
			},
		})
		getAccountNfts.mockResolvedValue({
			nfts: [listNft],
			next: 'cursor-account',
		})
		getNftsByContract.mockResolvedValue({
			nfts: [listNft],
			next: 'cursor-contract',
		})
	})

	it('registers under OpenSea_Rest for EvmNft and inventory parents', () => {
		expect(openSeaRest.source).toBe(Source.OpenSea_Rest)
		expect(openSeaRest.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.EvmNft,
			EntityType.EvmNetworkAccount,
			EntityType.EvmContract,
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

	it('projects account NFT inventory onto EvmNft refs with OpenSea continuation', async () => {
		const resolver = openSeaRest.resolvers[1]
		const snapshot = await resolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: {
				address: accountAddress,
			},
		}, context)

		expect(getAccountNfts).toHaveBeenCalledWith({
			chain: 'ethereum',
			address: accountAddress,
			limit: 16,
		})
		expect(resolver.projections.$$nfts.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$contract: {
					$network: network,
					address: contractAddress,
				},
				tokenId,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmNft, [], 'standard')]: EvmNftStandard.Erc721,
				[entityFieldAddressKey(EntityType.EvmNft, [], 'format')]: EvmNftFormat.Generic,
				[entityFieldAddressKey(EntityType.EvmNft, [], 'active')]: true,
				[entityFieldAddressKey(EntityType.EvmNft, [], 'tokenUri')]: 'ipfs://cid/metadata.json',
				[entityFieldAddressKey(EntityType.EvmNft, [], 'name')]: 'NFT',
				[entityFieldAddressKey(EntityType.EvmNft, [], 'description')]: 'Described',
				[entityFieldAddressKey(EntityType.EvmNft, [], 'image')]: 'https://images.example/nft.png',
			},
		}])
		expect(resolver.projections.$$nfts.continuation(snapshot)).toEqual({
			operation: 'account-nfts',
			target: accountAddress,
			terminal: false,
			token: 'cursor-account',
		})
	})

	it('projects contract NFT inventory onto EvmNft refs with OpenSea continuation', async () => {
		const resolver = openSeaRest.resolvers[2]
		const snapshot = await resolver.resolve.EvmNetworkAddress.resolve({
			$network: network,
			address: contractAddress,
		}, {
			...context,
			providerContinuationToken: 'cursor-prev',
		})

		expect(getNftsByContract).toHaveBeenCalledWith({
			chain: 'ethereum',
			address: contractAddress,
			limit: 16,
			next: 'cursor-prev',
		})
		expect(resolver.projections.$$nfts.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$contract: {
					$network: network,
					address: contractAddress,
				},
				tokenId,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmNft, [], 'standard')]: EvmNftStandard.Erc721,
				[entityFieldAddressKey(EntityType.EvmNft, [], 'format')]: EvmNftFormat.Generic,
				[entityFieldAddressKey(EntityType.EvmNft, [], 'active')]: true,
				[entityFieldAddressKey(EntityType.EvmNft, [], 'tokenUri')]: 'ipfs://cid/metadata.json',
				[entityFieldAddressKey(EntityType.EvmNft, [], 'name')]: 'NFT',
				[entityFieldAddressKey(EntityType.EvmNft, [], 'description')]: 'Described',
				[entityFieldAddressKey(EntityType.EvmNft, [], 'image')]: 'https://images.example/nft.png',
			},
		}])
		expect(resolver.projections.$$nfts.continuation(snapshot)).toEqual({
			operation: 'contract-nfts',
			target: contractAddress,
			terminal: false,
			token: 'cursor-contract',
		})
	})

	it('rejects contract inventory rows whose wire contract mismatches the parent', async () => {
		const resolver = openSeaRest.resolvers[2]
		getNftsByContract.mockResolvedValueOnce({
			nfts: [{
				...listNft,
				contract: accountAddress,
			}],
		})
		const snapshot = await resolver.resolve.EvmNetworkAddress.resolve({
			$network: network,
			address: contractAddress,
		}, context)

		expect(() => resolver.projections.$$nfts.select(snapshot)).toThrow('NFT contract mismatch')
	})
})
