import { readFileSync } from 'node:fs'

import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import bindings from '$/sources/Dydx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceDelivery, sourceBindingId } from '$/sources/SourceBinding.ts'


const dydxIndexerLive = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Dydx/WebSocket/live.remote.ts', () => ({
	dydxIndexerLive,
}))

const { subscribeDydxIndexer } = await import('$/sources/Dydx/WebSocket/queries.ts')
const binding = bindings[Source.DydxIndexer].find(({ delivery }) => delivery === SourceDelivery.RemoteLive)
if (binding == null)
	throw new Error('dYdX RemoteLive binding missing')

describe('dYdX Indexer live client', () => {
	beforeEach(() => {
		dydxIndexerLive.mockReset()
	})

	it('uses the fixed mainnet target and yields the typed remote stream', async () => {
		const returnIterator = vi.fn().mockResolvedValue({
			done: true,
			value: undefined,
		})
		const remoteIterator = {
			next: vi.fn()
				.mockResolvedValueOnce({
					done: false,
					value: {
						connection_id: 'connection-1',
						message_id: 0,
						type: 'connected',
					},
				})
				.mockResolvedValueOnce({
					done: true,
					value: undefined,
				}),
			return: returnIterator,
		}
		dydxIndexerLive.mockReturnValue({
			[Symbol.asyncIterator]: () => remoteIterator,
		})
		const subscription = {
			batched: true,
			channel: 'v4_orderbook',
			id: 'BTC-USD',
			type: 'subscribe',
		} as const
		const iterator = subscribeDydxIndexer(binding, subscription)

		expect(await iterator.next()).toEqual({
			done: false,
			value: {
				connection_id: 'connection-1',
				message_id: 0,
				type: 'connected',
			},
		})
		expect(await iterator.next()).toEqual({
			done: true,
			value: undefined,
		})
		expect(dydxIndexerLive).toHaveBeenCalledTimes(1)
		expect(dydxIndexerLive).toHaveBeenCalledWith({
			bindingId: sourceBindingId(binding),
			targetKey: 'cosmos:dydx-mainnet-1',
			subscription,
		})
		expect(returnIterator).toHaveBeenCalledTimes(1)
	})

	it('returns the remote iterator immediately when aborted', async () => {
		let finishRead: ((result: {
			done: true
			value: undefined
		}) => void) | undefined
		const returnIterator = vi.fn().mockImplementation(async () => {
			finishRead?.({
				done: true,
				value: undefined,
			})
			return {
				done: true,
				value: undefined,
			}
		})
		const remoteIterator = {
			next: vi.fn(() => new Promise((resolve) => {
				finishRead = resolve
			})),
			return: returnIterator,
		}
		dydxIndexerLive.mockReturnValue({
			[Symbol.asyncIterator]: () => remoteIterator,
		})
		const controller = new AbortController()
		const iterator = subscribeDydxIndexer(binding, {
			channel: 'v4_block_height',
			type: 'subscribe',
		}, controller.signal)
		const message = iterator.next()
		await Promise.resolve()

		controller.abort()
		expect(returnIterator).toHaveBeenCalledTimes(1)
		expect(await message).toEqual({
			done: true,
			value: undefined,
		})
	})

	it('does not import server-only implementation into the client query module', () => {
		const source = readFileSync('src/sources/Dydx/WebSocket/queries.ts', 'utf8')

		expect(source).toContain("from '$/sources/Dydx/WebSocket/live.remote.ts'")
		expect(source).not.toContain('.server.ts')
	})
})
