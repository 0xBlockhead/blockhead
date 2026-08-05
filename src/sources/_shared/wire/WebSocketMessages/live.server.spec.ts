import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import atprotoBindings from '$/sources/AtprotoSync/bindings.ts'
import bindings from '$/sources/Dydx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceOperationGroup } from '$/sources/SourceBinding.ts'
import { iterateWebSocketLive } from '$/sources/_shared/wire/WebSocketMessages/live.server.ts'


const sockets: WebSocketFixture[] = []

class WebSocketFixture {
	static readonly CONNECTING = 0
	static readonly OPEN = 1
	static readonly CLOSING = 2
	static readonly CLOSED = 3

	readonly url: string
	readonly sent: string[] = []
	readonly listeners = new Map<string, Set<(event: Event) => void>>()
	binaryType = 'blob'
	readyState = WebSocketFixture.CONNECTING
	closeCount = 0

	constructor(url: string) {
		this.url = url
		sockets.push(this)
	}

	addEventListener(type: string, listener: (event: Event) => void) {
		const listeners = this.listeners.get(type) ?? new Set()
		listeners.add(listener)
		this.listeners.set(type, listeners)
	}

	removeEventListener(type: string, listener: (event: Event) => void) {
		this.listeners.get(type)?.delete(listener)
	}

	dispatch(type: string, event: Event) {
		for (const listener of this.listeners.get(type) ?? [])
			listener(event)
	}

	open() {
		this.readyState = WebSocketFixture.OPEN
		this.dispatch('open', new Event('open'))
	}

	message(data: string | ArrayBuffer) {
		this.dispatch('message', new MessageEvent('message', {
			data,
		}))
	}

	fail() {
		const error = new Event('error')
		this.dispatch('error', error)
		return error
	}

	closeFromPeer({
		code = 1006,
		reason = 'Connection lost',
	}: {
		code?: number
		reason?: string
	} = {}) {
		this.readyState = WebSocketFixture.CLOSED
		this.dispatch('close', new CloseEvent('close', {
			code,
			reason,
			wasClean: code === 1000,
		}))
	}

	send(message: string) {
		this.sent.push(message)
	}

	close(_code?: number, _reason?: string) {
		this.closeCount += 1
		this.readyState = WebSocketFixture.CLOSED
		this.dispatch('close', new CloseEvent('close', {
			code: _code ?? 1000,
			reason: _reason ?? '',
			wasClean: true,
		}))
	}
}

const binding = bindings[Source.DydxIndexer][1]
const atprotoBinding = atprotoBindings[Source.AtprotoSync_Xrpc][1]

describe('managed WebSocket live transport', () => {
	afterEach(() => {
		sockets.length = 0
		vi.unstubAllGlobals()
	})

	it('sends the initial message exactly once and only after the socket opens', async () => {
		vi.stubGlobal('WebSocket', WebSocketFixture)
		const iterator = iterateWebSocketLive({
			binding,
			initialMessage: '{"type":"subscribe"}',
			operationGroup: SourceOperationGroup.GenericSubscribe,
		})
		const connected = iterator.next()
		await Promise.resolve()

		expect(sockets).toHaveLength(1)
		expect(sockets[0].url).toBe('wss://indexer.dydx.trade/v4/ws')
		expect(sockets[0].sent).toEqual([])

		sockets[0].open()
		expect(await connected).toEqual({
			done: false,
			value: {
				source: Source.DydxIndexer,
				targetKey: 'cosmos:dydx-mainnet-1',
				type: 'connected',
			},
		})
		expect(sockets[0].sent).toEqual(['{"type":"subscribe"}'])

		sockets[0].dispatch('open', new Event('open'))
		expect(sockets[0].sent).toEqual(['{"type":"subscribe"}'])
		await iterator.return(undefined)
	})

	it('delivers each message payload without changing it', async () => {
		vi.stubGlobal('WebSocket', WebSocketFixture)
		const iterator = iterateWebSocketLive({
			binding,
			operationGroup: SourceOperationGroup.GenericSubscribe,
		})
		const connected = iterator.next()
		await Promise.resolve()
		sockets[0].open()
		await connected

		const message = iterator.next()
		sockets[0].message('{"type":"connected","message_id":0}')
		expect(await message).toEqual({
			done: false,
			value: {
				payload: '{"type":"connected","message_id":0}',
				source: Source.DydxIndexer,
				targetKey: 'cosmos:dydx-mainnet-1',
				type: 'message',
			},
		})
		await iterator.return(undefined)
	})

	it('preserves binary frames as Uint8Array', async () => {
		vi.stubGlobal('WebSocket', WebSocketFixture)
		const iterator = iterateWebSocketLive({
			binding,
			operationGroup: SourceOperationGroup.GenericSubscribe,
		})
		const connected = iterator.next()
		await Promise.resolve()
		expect(sockets[0].binaryType).toBe('arraybuffer')
		sockets[0].open()
		await connected

		const message = iterator.next()
		sockets[0].message(new Uint8Array([1, 2, 3]).buffer)
		expect(await message).toMatchObject({
			value: {
				payload: new Uint8Array([1, 2, 3]),
			},
		})
		await iterator.return(undefined)
	})

	it('substitutes only a validated catalog host and preserves path while adding cursor', async () => {
		vi.stubGlobal('WebSocket', WebSocketFixture)
		const iterator = iterateWebSocketLive({
			binding: atprotoBinding,
			cursor: 42,
			operationGroup: SourceOperationGroup.GenericSubscribe,
			serviceOrigin: 'https://pds.example:8443',
		})
		const connected = iterator.next()
		await Promise.resolve()

		expect(sockets[0].url).toBe('wss://pds.example:8443/xrpc/com.atproto.sync.subscribeRepos?cursor=42')
		sockets[0].open()
		await connected
		await iterator.return(undefined)
	})

	it('rejects overrides for fixed endpoints', async () => {
		await expect(iterateWebSocketLive({
			binding,
			operationGroup: SourceOperationGroup.GenericSubscribe,
			serviceOrigin: 'https://pds.example',
		}).next()).rejects.toThrow('fixed WebSocket endpoint rejects service overrides')
		expect(sockets).toEqual([])
	})

	it.each([
		'http://pds.example',
		'https://user:p4ss@pds.example',
		'https://127.0.0.1',
		'https://10.0.0.1',
		'https://169.254.169.254',
		'https://[::1]',
		'https://metadata.google.internal',
		'https://pds.example/override',
	])('rejects unsafe service origin %s before opening a socket', async (serviceOrigin) => {
		await expect(iterateWebSocketLive({
			binding: atprotoBinding,
			operationGroup: SourceOperationGroup.GenericSubscribe,
			serviceOrigin,
		}).next()).rejects.toThrow('invalid public HTTPS service origin')
		expect(sockets).toEqual([])
	})

	it('propagates an unsolicited peer close from a pending read', async () => {
		vi.stubGlobal('WebSocket', WebSocketFixture)
		const iterator = iterateWebSocketLive({
			binding,
			operationGroup: SourceOperationGroup.GenericSubscribe,
		})
		const connected = iterator.next()
		await Promise.resolve()
		sockets[0].open()
		await connected

		const message = iterator.next()
		sockets[0].closeFromPeer()
		await expect(message).rejects.toThrow(
			'WebSocket closed by peer (1006: Connection lost)'
		)
		expect(sockets[0].closeCount).toBe(1)
	})

	it('propagates a peer close before the socket opens', async () => {
		vi.stubGlobal('WebSocket', WebSocketFixture)
		const iterator = iterateWebSocketLive({
			binding,
			operationGroup: SourceOperationGroup.GenericSubscribe,
		})
		const connected = iterator.next()
		await Promise.resolve()
		sockets[0].closeFromPeer({
			code: 1000,
			reason: 'Provider restart',
		})

		await expect(connected).rejects.toThrow(
			'WebSocket closed before opening for GenericSubscribe (1000: Provider restart)'
		)
		expect(sockets[0].closeCount).toBe(1)
	})

	it('propagates a peer close between connection and the first message read', async () => {
		vi.stubGlobal('WebSocket', WebSocketFixture)
		const iterator = iterateWebSocketLive({
			binding,
			operationGroup: SourceOperationGroup.GenericSubscribe,
		})
		const connected = iterator.next()
		await Promise.resolve()
		sockets[0].open()
		await connected
		sockets[0].closeFromPeer()

		await expect(iterator.next()).rejects.toThrow(
			'WebSocket closed by peer (1006: Connection lost)'
		)
		expect(sockets[0].closeCount).toBe(1)
	})

	it('bounds pending ingress and fails without discarding accepted messages', async () => {
		vi.stubGlobal('WebSocket', WebSocketFixture)
		const iterator = iterateWebSocketLive({
			binding,
			operationGroup: SourceOperationGroup.GenericSubscribe,
		})
		const connected = iterator.next()
		await Promise.resolve()
		sockets[0].open()
		await connected

		const firstMessage = iterator.next()
		for (let messageIndex = 0; messageIndex <= 1_024; messageIndex += 1)
			sockets[0].message(String(messageIndex))

		expect(sockets[0].closeCount).toBe(1)
		expect(await firstMessage).toMatchObject({
			done: false,
			value: {
				payload: '0',
			},
		})
		for (let messageIndex = 1; messageIndex < 1_024; messageIndex += 1)
			expect(await iterator.next()).toMatchObject({
				done: false,
				value: {
					payload: String(messageIndex),
				},
			})

		await expect(iterator.next()).rejects.toThrow(
			'WebSocket message buffer exceeded 1024 messages'
		)
	})

	it('aborts a pending read and closes the socket', async () => {
		vi.stubGlobal('WebSocket', WebSocketFixture)
		const controller = new AbortController()
		const iterator = iterateWebSocketLive({
			binding,
			operationGroup: SourceOperationGroup.GenericSubscribe,
			signal: controller.signal,
		})
		const connected = iterator.next()
		await Promise.resolve()
		sockets[0].open()
		await connected

		const message = iterator.next()
		controller.abort()
		expect(await message).toEqual({
			done: true,
			value: undefined,
		})
		expect(sockets[0].closeCount).toBe(1)
	})

	it('closes without sending when aborted before open', async () => {
		vi.stubGlobal('WebSocket', WebSocketFixture)
		const controller = new AbortController()
		const iterator = iterateWebSocketLive({
			binding,
			initialMessage: '{"type":"subscribe"}',
			operationGroup: SourceOperationGroup.GenericSubscribe,
			signal: controller.signal,
		})
		const connected = iterator.next()
		await Promise.resolve()
		controller.abort()

		expect(await connected).toEqual({
			done: true,
			value: undefined,
		})
		expect(sockets[0].sent).toEqual([])
		expect(sockets[0].closeCount).toBe(1)
	})

	it('propagates a socket error from a pending read', async () => {
		vi.stubGlobal('WebSocket', WebSocketFixture)
		const iterator = iterateWebSocketLive({
			binding,
			operationGroup: SourceOperationGroup.GenericSubscribe,
		})
		const connected = iterator.next()
		await Promise.resolve()
		sockets[0].open()
		await connected

		const message = iterator.next()
		const error = sockets[0].fail()
		await expect(message).rejects.toBe(error)
		expect(sockets[0].closeCount).toBe(1)
	})
})
