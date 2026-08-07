import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/ChainlinkDataFeeds/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceEndpointKind,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import {
	getLatestRound,
	getRoundData,
	readLatestRound,
} from '$/sources/ChainlinkDataFeeds/Contracts/queries.ts'
import {
	chainlinkJsonRpcResponseWire,
	chainlinkQuantityHexWire,
} from '$/sources/ChainlinkDataFeeds/Contracts/types.ts'

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	sourceFetch: vi.fn(),
}))

const placeholderBinding = bindings[Source.ChainlinkDataFeeds_Contracts][0]

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
	it('pins exact network, feed, aggregator, pair, signed units, upstream timestamps, and block provenance', async () => {
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
		})).rejects.toThrow('aggregator does not match catalog')
	})

	it('rejects malformed or incomplete upstream round lifecycle', async () => {
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
		})).rejects.toThrow('invalid latest round lifecycle')
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
		})).rejects.toThrow('invalid feed decimals')

		await expect(getLatestRound({
			binding,
			network,
			feedAddress: '0xdead',
			baseAsset: 'ETH',
			quoteAsset: 'USD',
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
		})).rejects.toThrow('response identity mismatch')
	})

	it('fail-closes arktype JSON-RPC envelopes and quantity wires', () => {
		expect(() => chainlinkJsonRpcResponseWire.assert({
			jsonrpc: '1.0',
			id: 'x',
			result: '0x1',
		})).toThrow()
		expect(() => chainlinkQuantityHexWire.assert('0x')).toThrow()
		expect(() => chainlinkQuantityHexWire.assert('1234')).toThrow()
		expect(chainlinkJsonRpcResponseWire.assert({
			jsonrpc: '2.0',
			id: 'ok',
			result: '0x1',
		})).toMatchObject({
			result: '0x1',
		})
	})

	it('reads a historical round through getRoundData', async () => {
		const roundId = (1n << 79n) + 10n
		mockRpcResults([
			'0x1234',
			latestRoundResponse({
				roundId,
				answeredInRound: roundId,
			}),
		])

		await expect(getRoundData({
			binding,
			network,
			feedAddress,
			roundId,
		})).resolves.toMatchObject({
			network,
			feedAddress,
			roundId: roundId.toString(),
			blockNumber: '4660',
		})

		const requests = vi.mocked(sourceFetch).mock.calls.map((call) => JSON.parse(String(call[2]?.body)))
		expect(requests[1].params[0]).toEqual({
			to: feedAddress,
			data: `0x9a6fc8f5${roundId.toString(16).padStart(64, '0')}`,
		})
	})

	it('projects readLatestRound through injected eth_call', async () => {
		const responses = [
			`0x${word(8n)}`,
			stringResponse('ETH / USD'),
			`0x${addressWord(aggregatorAddress)}`,
			latestRoundResponse(),
		]
		await expect(readLatestRound({
			network,
			feedAddress,
			baseAsset: 'ETH',
			quoteAsset: 'USD',
			getBlockNumber: async () => 0x1234n,
			getCall: async () => responses.shift() as `0x${string}`,
		})).resolves.toMatchObject({
			decimals: 8,
			description: 'ETH / USD',
			aggregatorAddress,
			blockNumber: '4660',
		})
	})
})
