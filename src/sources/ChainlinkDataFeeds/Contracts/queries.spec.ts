import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceEndpointKind,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { getLatestRound } from '$/sources/ChainlinkDataFeeds/Contracts/queries.ts'

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	sourceFetch: vi.fn(),
}))

const placeholderBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.ChainlinkDataFeeds_Contracts)
if (placeholderBinding == null)
	throw new Error('Chainlink contracts test binding is missing')

const network = 'eip155:1' as const
const binding = {
	...placeholderBinding,
	target: {
		kind: SourceTargetKind.Caip2Network,
		key: network,
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://ethereum-rpc.example',
		origin: 'https://ethereum-rpc.example',
		corsEnabled: false,
	}],
}
const feedAddress = '0x1111111111111111111111111111111111111111'
const aggregatorAddress = '0x2222222222222222222222222222222222222222'
const word = (value: bigint) => (
	(value < 0n ? (1n << 256n) + value : value)
		.toString(16)
		.padStart(64, '0')
)
const addressWord = (value: string) => value.slice(2).padStart(64, '0')
const stringResponse = (value: string) => {
	const bytes = new TextEncoder().encode(value)
	return `0x${word(32n)}${word(BigInt(bytes.length))}${[...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('').padEnd(Math.ceil(bytes.length / 32) * 64, '0')}`
}
const latestRoundResponse = ({
	roundId = (1n << 79n) + 25n,
	answer = -123_456_789_012_345_678_901n,
	startedAt = 1_699_999_890n,
	updatedAt = 1_699_999_900n,
	answeredInRound = roundId,
} = {}) => (
	`0x${[
		roundId,
		answer,
		startedAt,
		updatedAt,
		answeredInRound,
	].map(word).join('')}`
)

const mockRpcResults = (
	results: string[]
) => {
	vi.mocked(sourceFetch).mockImplementation(async (_binding, _url, init) => {
		const request = JSON.parse(String(init?.body))
		return new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: request.id,
			result: results.shift(),
		}))
	})
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('Chainlink latest feed round', () => {
	it('pins exact network, feed, aggregator, pair, signed units, round IDs, timestamps, staleness, and block provenance', async () => {
		mockRpcResults([
			'0x1234',
			`0x${word(8n)}`,
			stringResponse('ETH / USD'),
			`0x${addressWord(aggregatorAddress)}`,
			latestRoundResponse(),
		])

		await expect(getLatestRound({
			binding,
			network,
			feedAddress,
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			expectedAggregatorAddress: aggregatorAddress,
			staleAfterMs: 60_000,
			resolvedAtMs: 1_700_000_000_000,
		})).resolves.toEqual({
			network,
			feedAddress,
			aggregatorAddress,
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			description: 'ETH / USD',
			decimals: 8,
			roundId: ((1n << 79n) + 25n).toString(),
			answer: '-123456789012345678901',
			startedAtSeconds: '1699999890',
			updatedAtSeconds: '1699999900',
			answeredInRound: ((1n << 79n) + 25n).toString(),
			blockNumber: '4660',
			source: Source.ChainlinkDataFeeds_Contracts,
			resolvedAtMs: 1_700_000_000_000,
			staleAfterMs: 60_000,
			ageMs: 100_000,
			stale: true,
		})

		const requests = vi.mocked(sourceFetch).mock.calls.map((call) => JSON.parse(String(call[2]?.body)))
		expect(requests).toHaveLength(5)
		expect(requests[0]).toMatchObject({
			method: 'eth_blockNumber',
			params: [],
		})
		expect(requests.slice(1).map((request) => request.params[1])).toEqual([
			'0x1234',
			'0x1234',
			'0x1234',
			'0x1234',
		])
		expect(requests.slice(1).map((request) => request.params[0])).toEqual([
			{
				to: feedAddress,
				data: '0x313ce567',
			},
			{
				to: feedAddress,
				data: '0x7284e416',
			},
			{
				to: feedAddress,
				data: '0x245a7bfc',
			},
			{
				to: feedAddress,
				data: '0xfeaf968c',
			},
		])
	})

	it('rejects the catalog placeholder and foreign pair or aggregator identity', async () => {
		await expect(getLatestRound({
			binding: placeholderBinding,
			network,
			feedAddress,
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			staleAfterMs: 60_000,
		})).rejects.toThrow('exact EVM network JSON-RPC binding')

		mockRpcResults([
			'0x1234',
			`0x${word(8n)}`,
			stringResponse('BTC / USD'),
			`0x${addressWord(aggregatorAddress)}`,
			latestRoundResponse(),
		])
		await expect(getLatestRound({
			binding,
			network,
			feedAddress,
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			staleAfterMs: 60_000,
			resolvedAtMs: 1_700_000_000_000,
		})).rejects.toThrow('does not match base and quote')

		mockRpcResults([
			'0x1234',
			`0x${word(8n)}`,
			stringResponse('ETH / USD'),
			`0x${addressWord(aggregatorAddress)}`,
			latestRoundResponse(),
		])
		await expect(getLatestRound({
			binding,
			network,
			feedAddress,
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			expectedAggregatorAddress: '0x3333333333333333333333333333333333333333',
			staleAfterMs: 60_000,
			resolvedAtMs: 1_700_000_000_000,
		})).rejects.toThrow('aggregator does not match catalog')
	})

	it('rejects malformed or incomplete round lifecycle and future observations', async () => {
		mockRpcResults([
			'0x1234',
			`0x${word(8n)}`,
			stringResponse('ETH / USD'),
			`0x${addressWord(aggregatorAddress)}`,
			latestRoundResponse({
				roundId: 10n,
				answeredInRound: 9n,
			}),
		])
		await expect(getLatestRound({
			binding,
			network,
			feedAddress,
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			staleAfterMs: 60_000,
			resolvedAtMs: 1_700_000_000_000,
		})).rejects.toThrow('invalid latest round lifecycle')

		mockRpcResults([
			'0x1234',
			`0x${word(8n)}`,
			stringResponse('ETH / USD'),
			`0x${addressWord(aggregatorAddress)}`,
			latestRoundResponse({
				startedAt: 1_700_000_100n,
				updatedAt: 1_700_000_100n,
			}),
		])
		await expect(getLatestRound({
			binding,
			network,
			feedAddress,
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			staleAfterMs: 60_000,
			resolvedAtMs: 1_700_000_000_000,
		})).rejects.toThrow('timestamp is in the future')
	})

	it('rejects malformed ABI, decimals, addresses, and JSON-RPC response identity', async () => {
		mockRpcResults([
			'0x1234',
			`0x${word(256n)}`,
			stringResponse('ETH / USD'),
			`0x${addressWord(aggregatorAddress)}`,
			latestRoundResponse(),
		])
		await expect(getLatestRound({
			binding,
			network,
			feedAddress,
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			staleAfterMs: 60_000,
			resolvedAtMs: 1_700_000_000_000,
		})).rejects.toThrow('invalid feed decimals')

		await expect(getLatestRound({
			binding,
			network,
			feedAddress: '0xdead',
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			staleAfterMs: 60_000,
		})).rejects.toThrow('invalid feed address')

		vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: 'foreign',
			result: '0x1234',
		})))
		await expect(getLatestRound({
			binding,
			network,
			feedAddress,
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			staleAfterMs: 60_000,
		})).rejects.toThrow('response identity mismatch')
	})
})
