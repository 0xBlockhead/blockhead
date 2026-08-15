import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	decodeBencode,
	encodeBencode,
} from '$/sources/_shared/wire/Bencode/client.ts'
import type { BencodeValue } from '$/sources/_shared/wire/Bencode/types.ts'

const mocks = vi.hoisted(() => ({
	createDhtSocket: vi.fn(),
}))

vi.mock('$/sources/BitTorrent/Dht/client.ts', () => ({
	createDhtSocket: mocks.createDhtSocket,
}))

const {
	findNode,
	getPeers,
	ping,
} = await import('$/sources/BitTorrent/Dht/queries.ts')

const textEncoder = new TextEncoder()

const decodeRequest = (bytes: Uint8Array) => {
	const decoded = decodeBencode(bytes)
	if (!(decoded instanceof Object) || decoded instanceof Uint8Array || decoded instanceof Array || Number.isSafeInteger(decoded))
		throw new Error('expected request dict')
	return decoded
}

const expectQueryRequest = ({
	bytes,
	queryKind,
	nodeId,
	extraArguments = {},
}: {
	bytes: Uint8Array
	queryKind: string
	nodeId: Uint8Array
	extraArguments?: { [key: string]: BencodeValue }
}) => {
	const request = decodeRequest(bytes)
	expect(request.t).toHaveLength(2)
	expect(request.y).toEqual(textEncoder.encode('q'))
	expect(request.q).toEqual(textEncoder.encode(queryKind))
	expect(request.v).toEqual(textEncoder.encode('BH01'))
	expect(request.a).toEqual({
		id: nodeId,
		...extraArguments,
	})
	return request
}

const installFakeSocket = () => {
	let messageListener: ((bytes: Uint8Array) => void) | undefined
	let errorListener: ((error: Error) => void) | undefined
	const sentRequests: Uint8Array[] = []
	const send = vi.fn((bytes: Uint8Array) => {
		sentRequests.push(bytes)
	})
	const onMessage = vi.fn((listener: (bytes: Uint8Array) => void) => {
		messageListener = listener
	})
	const onError = vi.fn((listener: (error: Error) => void) => {
		errorListener = listener
	})
	const close = vi.fn()
	const socket = {
		send,
		close,
		sentRequests,
		emitRaw: (bytes: Uint8Array) => {
			if (messageListener == null)
				throw new Error('no message listener registered')
			messageListener(bytes)
		},
		reply: (response: BencodeValue) => {
			socket.emitRaw(encodeBencode(response))
		},
		emitError: (error: Error) => {
			if (errorListener == null)
				throw new Error('no error listener registered')
			errorListener(error)
		},
	}
	mocks.createDhtSocket.mockReturnValue({
		send,
		onMessage,
		onError,
		close,
	})
	return socket
}

describe('BitTorrent mainline DHT queries', () => {
	const nodeId = new Uint8Array(20).map((_, index) => index)
	const target = new Uint8Array(20).map((_, index) => 100 + index)
	const infoHash = new Uint8Array(20).map((_, index) => 150 + index)
	const remoteNodeId = new Uint8Array(20).map((_, index) => 200 + index)
	const remote = {
		host: 'router.bittorrent.com',
		port: 6881,
	}
	const compactPeer = new Uint8Array([
		0x0a, 0x00, 0x00, 0x01, 0x1a, 0xe1,
	])
	const token = textEncoder.encode('aoeusnth')

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('sends a canonical ping query and parses the responding node id', async () => {
		const socket = installFakeSocket()
		const promise = ping({ remote, nodeId })
		const request = expectQueryRequest({
			bytes: socket.sentRequests[0],
			queryKind: 'ping',
			nodeId,
		})
		socket.reply({ t: request.t, y: 'r', r: { id: remoteNodeId } })
		await expect(promise).resolves.toEqual({ remoteNodeId })
		expect(socket.close).toHaveBeenCalledOnce()
	})

	it('sends a find_node query with a target and parses compact node info', async () => {
		const socket = installFakeSocket()
		const compactNodes = new Uint8Array([
			...remoteNodeId,
			0x0a, 0x00, 0x00, 0x01, 0x1a, 0xe1,
		])
		const promise = findNode({ remote, nodeId, target })
		const request = expectQueryRequest({
			bytes: socket.sentRequests[0],
			queryKind: 'find_node',
			nodeId,
			extraArguments: { target },
		})
		socket.reply({
			t: request.t,
			y: 'r',
			r: { id: remoteNodeId, nodes: compactNodes },
		})
		await expect(promise).resolves.toEqual({
			remoteNodeId,
			nodes: [
				{
					nodeId: remoteNodeId,
					host: '10.0.0.1',
					port: 6881,
				},
			],
		})
	})

	it('fails closed when a find_node response omits the nodes key', async () => {
		const socket = installFakeSocket()
		const promise = findNode({ remote, nodeId, target })
		const request = decodeRequest(socket.sentRequests[0])
		socket.reply({ t: request.t, y: 'r', r: { id: remoteNodeId } })
		await expect(promise).rejects.toThrow('nodes must be a byte string')
	})

	it('sends a get_peers query and parses compact peers and nodes with the token', async () => {
		const socket = installFakeSocket()
		const secondPeer = new Uint8Array([
			0x0a, 0x00, 0x00, 0x02, 0x04, 0x39,
		])
		const closestNode = new Uint8Array([
			...target,
			0x0b, 0x0b, 0x0b, 0x0b, 0x1f, 0x90,
		])
		const promise = getPeers({ remote, nodeId, infoHash })
		const request = expectQueryRequest({
			bytes: socket.sentRequests[0],
			queryKind: 'get_peers',
			nodeId,
			extraArguments: { info_hash: infoHash },
		})
		socket.reply({
			t: request.t,
			y: 'r',
			r: {
				id: remoteNodeId,
				token,
				values: [compactPeer, secondPeer],
				nodes: closestNode,
			},
		})
		await expect(promise).resolves.toEqual({
			remoteNodeId,
			token,
			peers: [
				{ host: '10.0.0.1', port: 6881 },
				{ host: '10.0.0.2', port: 1081 },
			],
			nodes: [
				{
					nodeId: target,
					host: '11.11.11.11',
					port: 8080,
				},
			],
		})
	})

	it('handles a get_peers response with closest nodes but no stored peers', async () => {
		const socket = installFakeSocket()
		const closestNode = new Uint8Array([
			...target,
			0x0b, 0x0b, 0x0b, 0x0b, 0x1f, 0x90,
		])
		const promise = getPeers({ remote, nodeId, infoHash })
		const request = decodeRequest(socket.sentRequests[0])
		socket.reply({
			t: request.t,
			y: 'r',
			r: { id: remoteNodeId, token, nodes: closestNode },
		})
		await expect(promise).resolves.toEqual({
			remoteNodeId,
			token,
			peers: [],
			nodes: [
				{
					nodeId: target,
					host: '11.11.11.11',
					port: 8080,
				},
			],
		})
	})

	it('fails closed when a get_peers response omits the token', async () => {
		const socket = installFakeSocket()
		const promise = getPeers({ remote, nodeId, infoHash })
		const request = decodeRequest(socket.sentRequests[0])
		socket.reply({
			t: request.t,
			y: 'r',
			r: { id: remoteNodeId, values: [compactPeer] },
		})
		await expect(promise).rejects.toThrow('token must be a byte string')
	})

	it('fails closed when a get_peers response has non-list peer values', async () => {
		const socket = installFakeSocket()
		const promise = getPeers({ remote, nodeId, infoHash })
		const request = decodeRequest(socket.sentRequests[0])
		socket.reply({
			t: request.t,
			y: 'r',
			r: { id: remoteNodeId, token, values: 'not-a-list' },
		})
		await expect(promise).rejects.toThrow('must be a list of byte strings')
	})

	it('throws a KRPC error with code and message for error envelopes', async () => {
		const socket = installFakeSocket()
		const promise = findNode({ remote, nodeId, target })
		const request = decodeRequest(socket.sentRequests[0])
		socket.reply({
			t: request.t,
			y: 'e',
			e: [201, 'A Generic Error Ocurred'],
		})
		await expect(promise).rejects.toThrow('KRPC error 201: A Generic Error Ocurred')
	})

	it('fails closed on a transaction id mismatch', async () => {
		const socket = installFakeSocket()
		const promise = findNode({ remote, nodeId, target })
		const request = decodeRequest(socket.sentRequests[0])
		socket.reply({ t: new Uint8Array([0x00, 0x01]), y: 'r', r: { id: remoteNodeId, nodes: new Uint8Array(0) } })
		await expect(promise).rejects.toThrow('transaction id mismatch')
	})

	it('rejects with a timeout when no datagram arrives', async () => {
		const socket = installFakeSocket()
		await expect(ping({ remote, nodeId, timeoutMs: 10 })).rejects.toThrow('timed out')
		expect(socket.close).toHaveBeenCalledOnce()
	})

	it('rejects when the transport reports a socket error', async () => {
		const socket = installFakeSocket()
		const promise = ping({ remote, nodeId })
		socket.emitError(new Error('ECONNREFUSED'))
		await expect(promise).rejects.toThrow('ECONNREFUSED')
	})

	it('fails closed on invalid remote ports before touching the socket', async () => {
		await expect(ping({ remote: { ...remote, port: 0 }, nodeId })).rejects.toThrow(
			'invalid remote port 0'
		)
		expect(mocks.createDhtSocket).not.toHaveBeenCalled()
	})

	it('fails closed on node ids that are not 20 bytes', async () => {
		await expect(findNode({ remote, nodeId: new Uint8Array(19), target })).rejects.toThrow(
			'node id must be 20 bytes'
		)
		expect(mocks.createDhtSocket).not.toHaveBeenCalled()
	})

	it('fails closed on targets that are not 20 bytes', async () => {
		await expect(findNode({ remote, nodeId, target: new Uint8Array(21) })).rejects.toThrow(
			'target must be 20 bytes'
		)
		expect(mocks.createDhtSocket).not.toHaveBeenCalled()
	})

	it('fails closed on malformed bencode responses', async () => {
		const socket = installFakeSocket()
		const promise = findNode({ remote, nodeId, target })
		socket.emitRaw(textEncoder.encode('4:spa'))
		await expect(promise).rejects.toThrow('invalid KRPC response bencode')
	})

	it('fails closed on responses that are not KRPC responses', async () => {
		const socket = installFakeSocket()
		const promise = findNode({ remote, nodeId, target })
		const request = decodeRequest(socket.sentRequests[0])
		socket.reply({ t: request.t, y: 'x' })
		await expect(promise).rejects.toThrow('expected a KRPC response')
	})

	it('fails closed on compact node info that is not a multiple of 26 bytes', async () => {
		const socket = installFakeSocket()
		const promise = findNode({ remote, nodeId, target })
		const request = decodeRequest(socket.sentRequests[0])
		socket.reply({
			t: request.t,
			y: 'r',
			r: { id: remoteNodeId, nodes: new Uint8Array(27) },
		})
		await expect(promise).rejects.toThrow('not a multiple of 26')
	})

	it('fails closed on compact peer info that is not a multiple of 6 bytes', async () => {
		const socket = installFakeSocket()
		const promise = getPeers({ remote, nodeId, infoHash })
		const request = decodeRequest(socket.sentRequests[0])
		socket.reply({
			t: request.t,
			y: 'r',
			r: { id: remoteNodeId, token, values: [new Uint8Array(5)] },
		})
		await expect(promise).rejects.toThrow('not a multiple of 6')
	})
})
