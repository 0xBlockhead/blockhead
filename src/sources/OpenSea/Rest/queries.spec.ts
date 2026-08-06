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
	getCollection,
	getContract,
	getNft,
	getNftEvents,
	getNftOwners,
	getNftsByCollection,
	getNftsByContract,
	openSeaChainForChainId,
	requireOpenSeaCredential,
} from '$/sources/OpenSea/Rest/queries.ts'
import type {
	OpenSeaAccountEventsResponse,
	OpenSeaAccountNftsResponse,
	OpenSeaCollectionNftsResponse,
	OpenSeaCollectionResponse,
	OpenSeaContractNftsResponse,
	OpenSeaContractResponse,
	OpenSeaNftEventsResponse,
	OpenSeaNftOwnersResponse,
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
		| OpenSeaCollectionNftsResponse
		| OpenSeaCollectionResponse
		| OpenSeaContractNftsResponse
		| OpenSeaContractResponse
		| OpenSeaNftEventsResponse
		| OpenSeaNftOwnersResponse
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
		expect(openSeaChainForChainId(999)).toBe('hyperevm')
		expect(openSeaChainForChainId(1329)).toBe('sei')
		expect(openSeaChainForChainId(2741)).toBe('abstract')
		expect(() => openSeaChainForChainId(998877)).toThrow('unsupported EIP-155 chain 998877')
		expect(() => requireOpenSeaCredential()).toThrow('API key is required')
		process.env.OPENSEA_API_KEY = ' from-env '
		expect(requireOpenSeaCredential()).toBe('from-env')
	})

	it('hard-fails when NFT list payloads omit nfts', async () => {
		respond({
			next: 'cursor',
		} as OpenSeaContractNftsResponse)

		await expect(getNftsByContract({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
		})).rejects.toThrow('invalid contract NFTs response envelope')
	})

	it('hard-fails NFT list rows that violate the OpenAPI envelope', async () => {
		vi.mocked(sourceFetch).mockResolvedValueOnce(
			new Response(JSON.stringify({
				nfts: [{
					identifier: '1',
					collection: 'collection',
				}],
			}), {
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			})
		)

		await expect(getNftsByContract({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
		})).rejects.toThrow('invalid contract NFTs response envelope')
	})

	it('hard-fails incomplete NFT details instead of returning partial metadata', async () => {
		vi.mocked(sourceFetch).mockResolvedValueOnce(
			new Response(JSON.stringify({
				nft: {
					...nft,
					is_suspicious: false,
					creator: address,
				},
			}), {
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			})
		)

		await expect(getNft({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
			identifier: '1',
		})).rejects.toThrow('invalid NFT response envelope')
	})

	it('accepts NFT detail transport leftovers (rarity / animation / valuation) without projecting them', async () => {
		const leftoverNft = {
			...detailedNft,
			animation_url: 'https://images.example/nft.mp4',
			display_animation_url: 'https://images.example/nft-display.mp4',
			original_image_url: 'https://images.example/nft-original.png',
			estimated_value_usd: 12.5,
			decimals: 0,
			rarity: {
				strategy_id: 'openrarity',
				strategy_version: '1.0',
				rank: 42,
			},
			traits: [{
				trait_type: 'Background',
				value: 'Blue',
				display_type: 'string',
			}],
		} satisfies OpenSeaNftResponse['nft']

		respond({
			nft: leftoverNft,
		})

		await expect(getNft({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
			identifier: leftoverNft.identifier,
		})).resolves.toEqual({
			nft: leftoverNft,
		})
	})

	it('hard-fails NFT rarity leftovers that violate the OpenAPI spine', async () => {
		vi.mocked(sourceFetch).mockResolvedValueOnce(
			new Response(JSON.stringify({
				nft: {
					...detailedNft,
					rarity: {
						strategy_id: 'openrarity',
					},
				},
			}), {
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			})
		)

		await expect(getNft({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
			identifier: '1',
		})).rejects.toThrow('invalid NFT response envelope')
	})
})

describe('OpenSea contract / owners / collection endpoints', () => {
	it('fetches contract metadata with required address and collection', async () => {
		const response = {
			address: contract,
			chain: 'ethereum',
			collection: 'collection',
			contract_standard: 'erc721',
			name: 'Collection',
		} satisfies OpenSeaContractResponse

		respond(response)

		await expect(getContract({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
		})).resolves.toEqual(response)
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			`https://api.opensea.io/api/v2/chain/ethereum/contract/${contract}`,
			{
				headers: {
					accept: 'application/json',
					'x-api-key': 'secret',
				},
			}
		)
	})

	it('lists NFT owners with the documented 100 cap', async () => {
		const response = {
			owners: [{
				address,
				quantity: 1,
				quantity_string: '1',
			}],
			next: 'cursor',
		} satisfies OpenSeaNftOwnersResponse

		respond(response)

		await expect(getNftOwners({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
			identifier: '1',
			limit: 50,
			next: 'prior',
		})).resolves.toEqual(response)
		expect(vi.mocked(sourceFetch).mock.calls[0]?.[1]).toBe(
			`https://api.opensea.io/api/v2/chain/ethereum/contract/${contract}/nfts/1/owners?limit=50&next=prior`
		)
		await expect(getNftOwners({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
			identifier: '1',
			limit: 101,
		})).rejects.toThrow('between 1 and 100')
	})

	it('lists NFT events with repeated event_type filters', async () => {
		const response = {
			asset_events: [{
				event_type: 'sale',
				event_timestamp: 1_700_000_000,
				chain: 'ethereum',
				closing_date: 1_700_000_001,
				seller: address,
				buyer: address,
				quantity: 1,
			}],
			next: 'next',
		} satisfies OpenSeaNftEventsResponse

		respond(response)

		await expect(getNftEvents({
			credential: 'secret',
			chain: 'base',
			address: contract,
			identifier: '9',
			after: 1,
			before: 2,
			eventTypes: [
				'sale',
				'transfer',
			],
			limit: 10,
			next: 'cursor',
		})).resolves.toEqual(response)
		expect(vi.mocked(sourceFetch).mock.calls[0]?.[1]).toBe(
			`https://api.opensea.io/api/v2/events/chain/base/contract/${contract}/nfts/9?limit=10&next=cursor&after=1&before=2&event_type=sale&event_type=transfer`
		)
	})

	it('fetches collection detail and collection NFT pages', async () => {
		const paymentToken = {
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
			chain: 'ethereum',
			image: 'https://images.example/eth.png',
			name: 'Ether',
			decimals: 18,
			eth_price: '1',
			usd_price: '3000',
		}
		const collection = {
			collection: 'boredapeyachtclub',
			name: 'Bored Ape Yacht Club',
			description: 'BAYC',
			image_url: 'https://images.example/bayc.png',
			banner_image_url: 'https://images.example/bayc-banner.png',
			owner: address,
			safelist_status: 'verified',
			category: 'pfps',
			is_disabled: false,
			is_nsfw: false,
			trait_offers_enabled: false,
			collection_offers_enabled: true,
			opensea_url: 'https://opensea.io/collection/boredapeyachtclub',
			project_url: 'https://boredapeyachtclub.com',
			wiki_url: '',
			discord_url: '',
			telegram_url: '',
			twitter_username: 'BoredApeYC',
			instagram_username: '',
			contracts: [{
				address: contract,
				chain: 'ethereum',
			}],
			editors: [address],
			fees: [{
				fee: 2.5,
				recipient: address,
				required: true,
			}],
			total_supply: 10000,
			unique_item_count: 9999,
			created_date: '2021-04-22',
			pricing_currencies: {
				listing_currency: paymentToken,
				offer_currency: paymentToken,
			},
		} satisfies OpenSeaCollectionResponse

		respond(collection)
		await expect(getCollection({
			credential: 'secret',
			slug: 'boredapeyachtclub',
		})).resolves.toEqual(collection)
		expect(vi.mocked(sourceFetch).mock.calls[0]?.[1]).toBe(
			'https://api.opensea.io/api/v2/collections/boredapeyachtclub'
		)

		respond({
			nfts: [nft],
			next: 'cursor',
		})
		await expect(getNftsByCollection({
			credential: 'secret',
			slug: 'boredapeyachtclub',
			traits: '{"Background":["Blue"]}',
			has_agent_binding: true,
			limit: 25,
			next: 'prior',
		})).resolves.toEqual({
			nfts: [nft],
			next: 'cursor',
		})
		expect(vi.mocked(sourceFetch).mock.calls[1]?.[1]).toBe(
			'https://api.opensea.io/api/v2/collection/boredapeyachtclub/nfts?limit=25&next=prior&traits=%7B%22Background%22%3A%5B%22Blue%22%5D%7D&has_agent_binding=true'
		)
	})

	it('hard-fails collection payloads that omit contracts', async () => {
		respond({
			collection: 'slug',
			name: 'Name',
		} as OpenSeaCollectionResponse)

		await expect(getCollection({
			credential: 'secret',
			slug: 'slug',
		})).rejects.toThrow('invalid collection response envelope')
	})

	it('hard-fails NFT owners payloads that omit owners', async () => {
		respond({
			next: 'cursor',
		} as OpenSeaNftOwnersResponse)

		await expect(getNftOwners({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
			identifier: '1',
		})).rejects.toThrow('invalid NFT owners response envelope')
	})

	it('hard-fails asset event payloads that omit event_timestamp', async () => {
		vi.mocked(sourceFetch).mockResolvedValueOnce(
			new Response(JSON.stringify({
				asset_events: [{
					event_type: 'sale',
				}],
			}), {
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
			})
		)

		await expect(getNftEvents({
			credential: 'secret',
			chain: 'ethereum',
			address: contract,
			identifier: '1',
		})).rejects.toThrow('invalid NFT events response envelope')
	})
})
