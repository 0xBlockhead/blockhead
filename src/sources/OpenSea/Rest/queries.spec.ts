import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/OpenSea/bindings.ts'
import {
	getAccountEvents,
	getAccountNfts,
	getNft,
	getNftsByContract,
	openSeaChainForChainId,
	requireOpenSeaCredential,
} from '$/sources/OpenSea/Rest/queries.ts'
import type {
	OpenSeaAccountEventsResponse,
	OpenSeaAccountNftsResponse,
	OpenSeaContractNftsResponse,
	OpenSeaNftResponse,
} from '$/sources/OpenSea/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://api.opensea.io',
	sourceFetch: vi.fn(),
}))

const binding = bindings[Source.OpenSea_Rest][0]

const address = '0x1111111111111111111111111111111111111111'
const contract = '0x3333333333333333333333333333333333333333'

const nft = {
	identifier: '900719925474099312345',
	collection: 'collection',
	contract,
	token_standard: 'erc721',
	name: 'NFT',
	image_url: 'https://images.example/nft.png',
	metadata_url: 'ipfs://cid/metadata.json',
	opensea_url: 'https://opensea.io/item/1',
	updated_at: '2026-01-01T00:00:00.000Z',
	is_disabled: false,
	is_nsfw: false,
	traits: [],
} satisfies OpenSeaAccountNftsResponse['nfts'][number]

const detailedNft = {
	...nft,
	is_suspicious: false,
	creator: address,
	owners: [{
		address,
		quantity: 1,
		quantity_string: '1',
	}],
} satisfies OpenSeaNftResponse['nft']

const respond = (
	body: (
		| OpenSeaAccountEventsResponse
		| OpenSeaAccountNftsResponse
		| OpenSeaContractNftsResponse
		| OpenSeaNftResponse
	),
	status = 200
) => {
	vi.mocked(sourceFetch).mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: {
				'content-type': 'application/json',
			},
		})
	)
}

beforeEach(() => {
	vi.clearAllMocks()
	delete process.env.OPENSEA_API_KEY
})

describe('OpenSea account endpoints', () => {
	it('encodes every documented NFT account parameter', async () => {
		respond({
			nfts: [nft],
			next: 'cursor+/=',
		})

		await expect(getAccountNfts({
			credential: 'secret',
			chain: 'ethereum',
			address,
			collection: 'collection + one',
			limit: 50,
			next: 'prior+/=',
		})).resolves.toEqual({
			nfts: [nft],
			next: 'cursor+/=',
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			`https://api.opensea.io/api/v2/chain/ethereum/account/${address}/nfts?limit=50&next=prior%2B%2F%3D&collection=collection+%2B+one`,
			{
				headers: {
					accept: 'application/json',
					'x-api-key': 'secret',
				},
			}
		)
	})

	it('uses the official account-event filters and exact event response', async () => {
		const response = {
			asset_events: [{
				event_type: 'listing',
				event_timestamp: 1_700_000_000,
				chain: 'ethereum',
				order_type: 'basic',
				quantity: 1,
				maker: address,
				is_private_listing: false,
			}],
			next: 'next',
		} satisfies OpenSeaAccountEventsResponse

		respond(response)

		await expect(getAccountEvents({
			credential: 'secret',
			address,
			after: 1_700_000_000,
			before: 1_800_000_000,
			eventTypes: [
				'sale',
				'transfer',
				'mint',
				'listing',
				'offer',
				'trait_offer',
				'collection_offer',
			],
			chain: 'ethereum',
			limit: 20,
			next: 'cursor+/=',
		})).resolves.toEqual(response)
		expect(vi.mocked(sourceFetch).mock.calls[0]?.[1]).toBe(
			`https://api.opensea.io/api/v2/events/accounts/${address}?limit=20&next=cursor%2B%2F%3D&after=1700000000&before=1800000000&chain=ethereum&event_type=sale&event_type=transfer&event_type=mint&event_type=listing&event_type=offer&event_type=trait_offer&event_type=collection_offer`
		)
	})

	it('keeps credential and pagination policy at the source boundary', async () => {
		await expect(getAccountNfts({
			credential: '',
			chain: 'ethereum',
			address,
		})).rejects.toThrow('API key is required')
		await expect(getAccountNfts({
			credential: 'secret',
			chain: 'ethereum',
			address,
			limit: 201,
		})).rejects.toThrow('between 1 and 200')
		await expect(getAccountEvents({
			credential: 'secret',
			address,
			next: '',
		})).rejects.toThrow('opaque and nonempty')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})

describe('OpenSea NFT endpoints', () => {
	it('fetches a single NFT by chain, contract, and identifier', async () => {
		respond({
			nft: detailedNft,
		})

		await expect(getNft({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
			identifier: detailedNft.identifier,
		})).resolves.toEqual({
			nft: detailedNft,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			`https://api.opensea.io/api/v2/chain/ethereum/contract/${contract}/nfts/${detailedNft.identifier}`,
			{
				headers: {
					accept: 'application/json',
					'x-api-key': 'secret',
				},
			}
		)
	})

	it('lists NFTs for a contract with pagination', async () => {
		respond({
			nfts: [nft],
			next: 'cursor',
		})

		await expect(getNftsByContract({
			credential: 'secret',
			chain: 'base',
			address: contract,
			limit: 25,
			next: 'prior',
		})).resolves.toEqual({
			nfts: [nft],
			next: 'cursor',
		})
		expect(vi.mocked(sourceFetch).mock.calls[0]?.[1]).toBe(
			`https://api.opensea.io/api/v2/chain/base/contract/${contract}/nfts?limit=25&next=prior`
		)
	})

	it('hard-fails non-OK HTTP instead of soft-emptying', async () => {
		respond({
			nft: detailedNft,
		}, 503)

		await expect(getNft({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
			identifier: '1',
		})).rejects.toThrow()
	})

	it('maps supported EIP-155 chains and requires OPENSEA_API_KEY', () => {
		expect(openSeaChainForChainId(1)).toBe('ethereum')
		expect(openSeaChainForChainId(8453)).toBe('base')
		expect(() => openSeaChainForChainId(999)).toThrow('unsupported EIP-155 chain 999')
		expect(() => requireOpenSeaCredential()).toThrow('API key is required')
		process.env.OPENSEA_API_KEY = ' from-env '
		expect(requireOpenSeaCredential()).toBe('from-env')
	})
})
