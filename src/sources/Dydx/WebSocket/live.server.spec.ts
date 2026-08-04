import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import { SourceOperationGroup } from '$/sources/SourceBinding.ts'


const iterateSourceLive = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/live.server.ts', () => ({
	iterateSourceLive,
}))

const { iterateDydxIndexerLive } = await import('$/sources/Dydx/WebSocket/live.server.ts')

describe('dYdX Indexer managed live transport', () => {
	beforeEach(() => {
		iterateSourceLive.mockReset()
	})

	it('sends the exact subscription, suppresses the socket-open event, and parses provider messages', async () => {
		iterateSourceLive.mockImplementation(async function* () {
			yield {
				source: Source.DydxIndexer,
				targetKey: 'cosmos:dydx-mainnet-1',
				type: 'connected',
			}
			yield {
				payload: '{"type":"connected","connection_id":"connection-1","message_id":0}',
				source: Source.DydxIndexer,
				targetKey: 'cosmos:dydx-mainnet-1',
				type: 'message',
			}
			yield {
				payload: '{"type":"channel_data","connection_id":"connection-1","message_id":1,"channel":"v4_orderbook","id":"BTC-USD","version":"1.0.0","contents":{"bids":[["65554","0"]]}}',
				source: Source.DydxIndexer,
				targetKey: 'cosmos:dydx-mainnet-1',
				type: 'message',
			}
		})
		const controller = new AbortController()
		const subscription = {
			type: 'subscribe',
			channel: 'v4_orderbook',
			id: 'BTC-USD',
			batched: true,
		} as const
		const messages = []

		for await (const message of iterateDydxIndexerLive({
			targetKey: 'cosmos:dydx-mainnet-1',
			subscription,
		}, controller.signal))
			messages.push(message)

		expect(iterateSourceLive).toHaveBeenCalledTimes(1)
		expect(iterateSourceLive).toHaveBeenCalledWith({
			operationGroup: SourceOperationGroup.GenericSubscribe,
			source: Source.DydxIndexer,
			targetKey: 'cosmos:dydx-mainnet-1',
		}, controller.signal, '{"type":"subscribe","channel":"v4_orderbook","id":"BTC-USD","batched":true}')
		expect(messages).toEqual([
			{
				connection_id: 'connection-1',
				message_id: 0,
				type: 'connected',
			},
			{
				channel: 'v4_orderbook',
				connection_id: 'connection-1',
				contents: {
					bids: [[
						'65554',
						'0',
					]],
				},
				id: 'BTC-USD',
				message_id: 1,
				type: 'channel_data',
				version: '1.0.0',
			},
		])
	})

	it('rejects malformed provider payloads instead of yielding unknown data', async () => {
		iterateSourceLive.mockImplementation(async function* () {
			yield {
				source: Source.DydxIndexer,
				targetKey: 'cosmos:dydx-mainnet-1',
				type: 'connected',
			}
			yield {
				payload: '{"type":"connected","connection_id":"connection-1","message_id":0,"undeclared":true}',
				source: Source.DydxIndexer,
				targetKey: 'cosmos:dydx-mainnet-1',
				type: 'message',
			}
		})

		const iterator = iterateDydxIndexerLive({
			targetKey: 'cosmos:dydx-mainnet-1',
			subscription: {
				channel: 'v4_block_height',
				type: 'subscribe',
			},
		})

		await expect(iterator.next()).rejects.toThrow('undeclared must be removed')
	})

	it('rejects a foreign gRPC event on the WebSocket binding', async () => {
		iterateSourceLive.mockImplementation(async function* () {
			yield {
				messageBase64: 'AA==',
				source: Source.DydxIndexer,
				targetKey: 'cosmos:dydx-mainnet-1',
				type: 'grpc-message',
			}
		})

		const iterator = iterateDydxIndexerLive({
			targetKey: 'cosmos:dydx-mainnet-1',
			subscription: {
				channel: 'v4_block_height',
				type: 'subscribe',
			},
		})

		await expect(iterator.next()).rejects.toThrow(
			'DydxIndexer_WebSocket: subscription received a gRPC message'
		)
	})
})
