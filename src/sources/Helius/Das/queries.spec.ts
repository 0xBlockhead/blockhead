import { base58 } from '@scure/base'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Helius/bindings.ts'
import { getAssetsByOwner } from '$/sources/Helius/Das/queries.ts'
import type {
	DasAsset,
	GetAssetsByOwnerResult,
} from '$/sources/Helius/Das/types.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	sourceFetch: vi.fn(),
}))

const binding = bindings[Source.Helius].find(
	({ apiFamily }) => apiFamily === ApiFamily.MetaplexDasJsonRpc
)

if (binding == null)
	throw new Error('Helius DAS test binding is missing')

const address = (value: number) => base58.encode(new Uint8Array(32).fill(value))
const ownerAddress = address(1)
const assetId = address(2)

const asset = {
	interface: 'V1_NFT',
	id: assetId,
	content: {
		$schema: 'https://schema.metaplex.com/nft1.0.json',
		json_uri: 'ipfs://metadata-cid/asset.json',
		metadata: {
			name: 'Exact asset',
			symbol: 'EXACT',
		},
	},
	compression: {
		eligible: true,
		compressed: true,
		data_hash: address(3),
		creator_hash: address(4),
		asset_hash: address(5),
		tree: address(6),
		seq: 99,
		leaf_id: 4,
	},
	ownership: {
		frozen: false,
		delegated: false,
		owner: ownerAddress,
		ownership_model: 'single',
	},
	royalty: {
		royalty_model: 'creators',
		percent: 0.05,
		basis_points: 500,
		primary_sale_happened: true,
		locked: false,
	},
	mutable: true,
	burnt: false,
} as const satisfies DasAsset

const result = {
	last_indexed_slot: 365_750_752,
	total: 1,
	limit: 1,
	page: 1,
	items: [asset],
} satisfies GetAssetsByOwnerResult

beforeEach(() => {
	vi.clearAllMocks()
})

describe('Helius Metaplex DAS transport', () => {
	it('executes the named owner-assets operation through the Helius DAS binding', async () => {
		vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: `${ownerAddress}:page:1`,
			result,
		})))

		await expect(getAssetsByOwner({
			ownerAddress,
			limit: 1,
			publicEnv: {
				PUBLIC_HELIUS_API_KEY: 'helius key',
			},
		})).resolves.toEqual(result)

		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://mainnet.helius-rpc.com/?api-key=helius%20key',
			{
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: `${ownerAddress}:page:1`,
					method: 'getAssetsByOwner',
					params: {
						ownerAddress,
						limit: 1,
						page: 1,
						displayOptions: {
							showFungible: true,
						},
					},
				}),
			}
		)
	})

	it('keeps cursor pagination mutually exclusive and validates bounded inputs', async () => {
		vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: `${ownerAddress}:after:opaque+cursor/2`,
			result: {
				...result,
				page: 2,
			},
		})))

		await expect(getAssetsByOwner({
			ownerAddress,
			limit: 1,
			pagination: {
				after: 'opaque+cursor/2',
			},
			publicEnv: {
				PUBLIC_HELIUS_API_KEY: 'key',
			},
		})).resolves.toMatchObject({
			page: 2,
		})

		await expect(getAssetsByOwner({
			ownerAddress,
			limit: 1_001,
			publicEnv: {},
		})).rejects.toThrow('limit must be an integer')
	})

	it('fails closed on invalid owners and mismatched JSON-RPC responses', async () => {
		await expect(getAssetsByOwner({
			ownerAddress: 'invalid',
			publicEnv: {},
		})).rejects.toThrow('invalid owner address')

		vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: 'foreign-request',
			result,
		})))
		await expect(getAssetsByOwner({
			ownerAddress,
			publicEnv: {
				PUBLIC_HELIUS_API_KEY: 'key',
			},
		})).rejects.toThrow('response identity does not match request')
	})
})
