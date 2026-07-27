import { base58 } from '@scure/base'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/MetaplexDAS/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { getAssetsByOwner } from '$/sources/MetaplexDAS/Rest/queries.ts'
import type {
	MetaplexDASAsset,
	MetaplexDASAssetsByOwnerResult,
} from '$/sources/MetaplexDAS/Rest/types.ts'

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	sourceFetch: vi.fn(),
}))

const placeholderBinding = bindings[Source.MetaplexDAS_Rest]

const network = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' as const
const binding = {
	...placeholderBinding,
	target: {
		kind: SourceTargetKind.Caip2Network,
		key: network,
	},
}
const address = (value: number) => base58.encode(new Uint8Array(32).fill(value))
const ownerAddress = address(1)
const assetId = address(2)
const delegate = address(3)
const creator = address(4)
const tree = address(5)
const dataHash = address(6)
const creatorHash = address(7)
const assetHash = address(8)
const fungibleAssetId = address(9)

const asset = {
	interface: 'V1_NFT',
	id: assetId,
	content: {
		$schema: 'https://schema.metaplex.com/nft1.0.json',
		json_uri: 'ipfs://metadata-cid/asset.json',
		files: [{
			uri: 'ar://image-transaction',
			cdn_uri: 'https://cdn.example/image.png',
			mime: 'image/png',
		}],
		metadata: {
			name: 'Exact asset',
			symbol: 'EXACT',
		},
	},
	authorities: [{
		address: creator,
		scopes: ['full'],
	}],
	compression: {
		eligible: false,
		compressed: true,
		data_hash: dataHash,
		creator_hash: creatorHash,
		asset_hash: assetHash,
		tree,
		seq: 99,
		leaf_id: 4,
	},
	grouping: [{
		group_key: 'collection',
		group_value: creator,
	}],
	royalty: {
		royalty_model: 'creators',
		target: creator,
		percent: 0.05,
		basis_points: 500,
		primary_sale_happened: true,
		locked: false,
	},
	creators: [{
		address: creator,
		share: 100,
		verified: true,
	}],
	ownership: {
		frozen: false,
		delegated: true,
		delegate,
		ownership_model: 'single',
		owner: ownerAddress,
	},
	mutable: true,
	burnt: false,
} as const satisfies MetaplexDASAsset

const result = {
	last_indexed_slot: 365_750_752,
	total: 2,
	limit: 2,
	page: 1,
	items: [
		asset,
		{
			...asset,
			interface: 'FungibleToken',
			id: fungibleAssetId,
			compression: {
				eligible: false,
				compressed: false,
			},
			ownership: {
				frozen: false,
				delegated: false,
				delegate: null,
				ownership_model: 'token',
				owner: ownerAddress,
			},
			token_info: {
				symbol: 'TOKEN',
				balance: 9_007_199_254_740_991,
				supply: 9_007_199_254_740_991,
				decimals: 9,
				associated_token_address: address(10),
			},
		},
	],
} satisfies MetaplexDASAssetsByOwnerResult

const respond = (
	responseResult = result,
	id = `${network}:${ownerAddress}:page:1`
) => {
	vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(JSON.stringify({
		jsonrpc: '2.0',
		id,
		result: responseResult,
	})))
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('Metaplex DAS owner assets', () => {
	it('preserves exact NFT, compressed, fungible, ownership, metadata-reference, and provenance fields', async () => {
		respond()

		await expect(getAssetsByOwner({
			binding,
			network,
			ownerAddress,
			limit: 2,
		})).resolves.toMatchObject({
			network,
			ownerAddress,
			source: Source.MetaplexDAS_Rest,
			last_indexed_slot: 365_750_752,
			items: [
				{
					id: assetId,
					interface: 'V1_NFT',
					compression: {
						compressed: true,
						tree,
						leaf_id: 4,
					},
					ownership: {
						owner: ownerAddress,
						delegate,
					},
					royalty: {
						basis_points: 500,
					},
				},
				{
					id: fungibleAssetId,
					interface: 'FungibleToken',
					token_info: {
						balance: 9_007_199_254_740_991,
					},
				},
			],
		})

		expect(sourceFetch).toHaveBeenCalledOnce()
		const request = vi.mocked(sourceFetch).mock.calls[0]
		expect(request[0]).toBe(binding)
		expect(request[1]).toBe('https://{metaplex-das-api-host}')
		expect(JSON.parse(String(request[2]?.body))).toEqual({
			jsonrpc: '2.0',
			id: `${network}:${ownerAddress}:page:1`,
			method: 'getAssetsByOwner',
			params: {
				ownerAddress,
				limit: 2,
				page: 1,
				displayOptions: {
					showFungible: true,
				},
			},
		})
	})

	it('supports bounded opaque cursors without mixing pagination modes', async () => {
		respond({
			...result,
			page: 2,
		}, `${network}:${ownerAddress}:after:opaque+cursor/2`)

		await expect(getAssetsByOwner({
			binding,
			network,
			ownerAddress,
			limit: 2,
			pagination: {
				after: 'opaque+cursor/2',
			},
		})).resolves.toMatchObject({
			page: 2,
		})

		await expect(getAssetsByOwner({
			binding,
			network,
			ownerAddress,
			pagination: {
				page: 0,
			},
		})).rejects.toThrow('page must be a positive')
		await expect(getAssetsByOwner({
			binding,
			network,
			ownerAddress,
			limit: 1_001,
		})).rejects.toThrow('limit must be an integer')
	})

	it('rejects global bindings, foreign owners, duplicates, and mismatched response identity', async () => {
		await expect(getAssetsByOwner({
			binding: placeholderBinding,
			network,
			ownerAddress,
		})).rejects.toThrow('exact Solana network binding')

		respond({
			...result,
			items: [{
				...asset,
				ownership: {
					...asset.ownership,
					owner: address(11),
				},
			}],
		})
		await expect(getAssetsByOwner({
			binding,
			network,
			ownerAddress,
			limit: 2,
		})).rejects.toThrow('owner does not match')

		respond({
			...result,
			items: [
				asset,
				asset,
			],
		})
		await expect(getAssetsByOwner({
			binding,
			network,
			ownerAddress,
			limit: 2,
		})).rejects.toThrow('duplicate asset identity')

		respond(result, 'foreign-request')
		await expect(getAssetsByOwner({
			binding,
			network,
			ownerAddress,
			limit: 2,
		})).rejects.toThrow('response identity does not match')
	})

	it('rejects malformed compressed identities and lossy fungible quantities', async () => {
		respond({
			...result,
			items: [{
				...asset,
				compression: {
					...asset.compression,
					tree: 'malformed',
				},
			}],
		})
		await expect(getAssetsByOwner({
			binding,
			network,
			ownerAddress,
			limit: 2,
		})).rejects.toThrow('compression tree')

		respond({
			...result,
			items: [{
				...result.items[1],
				token_info: {
					...result.items[1].token_info,
					balance: 9_007_199_254_740_992,
				},
			}],
		})
		await expect(getAssetsByOwner({
			binding,
			network,
			ownerAddress,
			limit: 2,
		})).rejects.toThrow('lossy fungible balance')
	})
})
