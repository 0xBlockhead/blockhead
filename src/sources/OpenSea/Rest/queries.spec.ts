import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import {
	getAccountEvents,
	getAccountNfts,
} from '$/sources/OpenSea/Rest/queries.ts'

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://api.opensea.test',
	sourceFetch: vi.fn(),
}))

const binding = {
	provider: SourceProvider.OpenSea,
	source: Source.OpenSea_Rest,
	target: {
		kind: SourceTargetKind.Global,
		key: 'opensea-api',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://api.opensea.test',
		origin: 'https://api.opensea.test',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.OpenApiHttp,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.ServerOnly,
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
	}],
} as const satisfies SourceBinding

const address = '0x1111111111111111111111111111111111111111'
const counterparty = '0x2222222222222222222222222222222222222222'
const contract = '0x3333333333333333333333333333333333333333'
const transaction = `0x${'4'.repeat(64)}`

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
}

const respond = (
	body: unknown
) => {
	vi.mocked(sourceFetch).mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			headers: {
				'content-type': 'application/json',
			},
		})
	)
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('OpenSea public owner reads', () => {
	it('fetches an exact chain-scoped owner page with opaque continuation', async () => {
		respond({
			nfts: [nft],
			next: 'cursor+/=',
		})

		await expect(getAccountNfts({
			binding,
			credential: 'secret',
			chain: 'ethereum',
			address,
			limit: 50,
			next: 'prior+/=',
		})).resolves.toMatchObject({
			nfts: [{
				identifier: '900719925474099312345',
			}],
			next: 'cursor+/=',
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			`https://api.opensea.test/api/v2/chain/ethereum/account/${address}/nfts?limit=50&next.value=prior%2B%2F%3D`,
			{
				headers: {
					accept: 'application/json',
					'x-api-key': 'secret',
				},
			}
		)
	})

	it('rejects duplicate NFT identities and invalid bounds', async () => {
		respond({
			nfts: [
				nft,
				nft,
			],
		})

		await expect(getAccountNfts({
			binding,
			credential: 'secret',
			chain: 'base',
			address,
		})).rejects.toThrow('duplicate NFTs')
		await expect(getAccountNfts({
			binding,
			credential: 'secret',
			chain: 'base',
			address,
			limit: 201,
		})).rejects.toThrow('between 1 and 200')
		expect(sourceFetch).toHaveBeenCalledTimes(1)
	})

	it('keeps account sales and transfers chain- and subject-bound', async () => {
		respond({
			asset_events: [
				{
					event_type: 'sale',
					event_timestamp: 1_700_000_000,
					transaction,
					chain: 'ethereum',
					closing_date: 1_700_000_000,
					seller: address,
					buyer: counterparty,
					quantity: 1,
					nft,
				},
				{
					event_type: 'transfer',
					event_timestamp: 1_700_000_001,
					transaction,
					chain: 'ethereum',
					transfer_type: 'single',
					from_address: counterparty,
					to_address: address,
					quantity: 1,
					nft,
				},
			],
			next: 'next',
		})

		await expect(getAccountEvents({
			binding,
			credential: 'secret',
			chain: 'ethereum',
			address,
			limit: 2,
		})).resolves.toMatchObject({
			asset_events: [
				{
					event_type: 'sale',
				},
				{
					event_type: 'transfer',
				},
			],
		})
		expect(vi.mocked(sourceFetch).mock.calls[0]?.[1]).toBe(
			`https://api.opensea.test/api/v2/events/accounts/${address}?limit=2&chain=ethereum&event_type=sale&event_type=transfer&event_type=mint`
		)
	})

	it('fails closed on foreign activity and missing credentials', async () => {
		respond({
			asset_events: [{
				event_type: 'transfer',
				event_timestamp: 1_700_000_001,
				chain: 'base',
				transfer_type: 'single',
				from_address: counterparty,
				to_address: contract,
				quantity: 1,
			}],
		})

		await expect(getAccountEvents({
			binding,
			credential: 'secret',
			chain: 'base',
			address,
		})).rejects.toThrow('foreign transfer')
		await expect(getAccountNfts({
			binding,
			credential: '',
			chain: 'ethereum',
			address,
		})).rejects.toThrow('API key is required')
	})
})
