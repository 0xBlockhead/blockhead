import { beforeEach, expect, it, vi } from 'vitest'

type SocketListener = (event: { data?: string }) => void

class FakeWebSocket {
	static instances: FakeWebSocket[] = []

	readonly listeners = new Map<string, SocketListener>()
	readonly send = vi.fn()
	readonly close = vi.fn()

	constructor(readonly url: string) {
		FakeWebSocket.instances.push(this)
	}

	addEventListener(type: string, listener: SocketListener) {
		this.listeners.set(type, listener)
	}

	emit(type: string, data?: string) {
		this.listeners.get(type)?.({ data })
	}
}

vi.stubGlobal('WebSocket', FakeWebSocket)
vi.stubGlobal('crypto', {
	randomUUID: vi.fn(() => 'request-id'),
})

const {
	getAddressUtxos,
	getBlockDagInfo,
	getVirtualChain,
} = await import('$/sources/KaspaNode/Wrpc/queries.ts')

beforeEach(() => {
	FakeWebSocket.instances.length = 0
})

const openRequest = () => {
	const socket = FakeWebSocket.instances[0]
	if (socket == null)
		throw new Error('Kaspa WRPC spec missing socket')
	socket.emit('open')
	return socket
}

it('sends parameterless and parameterized WRPC requests and closes after matching results', async () => {
	const dagPromise = getBlockDagInfo()
	const dagSocket = openRequest()
	expect(dagSocket.url).toBe('env:KASPA_NODE_WRPC_URL')
	expect(JSON.parse(dagSocket.send.mock.calls[0][0])).toEqual({
		id: 'request-id',
		method: 'getBlockDagInfo',
		params: {},
	})
	dagSocket.emit('message', JSON.stringify({
		id: 'request-id',
		result: { blockCount: '42' },
	}))
	await expect(dagPromise).resolves.toEqual({ blockCount: '42' })
	expect(dagSocket.close).toHaveBeenCalledOnce()

	const utxoPromise = getAddressUtxos({ address: 'kaspa:fixture' })
	const utxoSocket = FakeWebSocket.instances[1]
	utxoSocket.emit('open')
	expect(JSON.parse(utxoSocket.send.mock.calls[0][0])).toMatchObject({
		method: 'getUtxosByAddresses',
		params: {
			addresses: ['kaspa:fixture'],
		},
	})
	utxoSocket.emit('message', JSON.stringify({
		id: 'request-id',
		result: [],
	}))
	await expect(utxoPromise).resolves.toEqual([])
})

it('preserves optional virtual-chain parameters', async () => {
	const result = getVirtualChain({
		startHash: 'start',
		minConfirmationCount: 7,
	})
	const socket = openRequest()
	expect(JSON.parse(socket.send.mock.calls[0][0])).toMatchObject({
		method: 'getVirtualChainFromBlock',
		params: {
			startHash: 'start',
			includeAcceptedTransactionIds: true,
			minConfirmationCount: 7,
		},
	})
	socket.emit('message', JSON.stringify({
		id: 'request-id',
		result: { acceptedTransactionIds: [] },
	}))
	await result
})

it.each([
	['upstream error', JSON.stringify({ id: 'request-id', error: { message: 'denied' } }), 'KaspaNode_Wrpc: denied'],
	['missing result', JSON.stringify({ id: 'request-id' }), 'returned no result'],
	['malformed JSON', '{', 'returned malformed JSON'],
] as const)('rejects %s and closes the socket', async (_label, response, error) => {
	const result = getBlockDagInfo()
	const socket = openRequest()
	socket.emit('message', response)

	await expect(result).rejects.toThrow(error)
	expect(socket.close).toHaveBeenCalledOnce()
})

it('rejects transport errors and closes the socket', async () => {
	const result = getBlockDagInfo()
	const socket = openRequest()
	socket.emit('error')

	await expect(result).rejects.toThrow('transport failed')
	expect(socket.close).toHaveBeenCalledOnce()
})
