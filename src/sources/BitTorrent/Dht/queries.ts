import {
	createHash,
	randomBytes,
} from 'node:crypto'

import { ed25519 } from '@noble/curves/ed25519.js'

import {
	decodeBencode,
	encodeBencode,
} from '$/sources/_shared/wire/Bencode/client.ts'
import type { BencodeValue } from '$/sources/_shared/wire/Bencode/types.ts'
import bindings from '$/sources/BitTorrent/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	createDhtSocket,
	type DhtRemote,
	type DhtSocket,
} from '$/sources/BitTorrent/Dht/client.ts'
import {
	dhtNodeIdLength,
	dhtPublicKeyLength,
	dhtSignatureLength,
	krpcMessageWire,
	type CompactNodeInfo,
	type CompactPeerInfo,
	type DhtQueryKind,
	type FindNodeResult,
	type GetPeersResult,
	type GetResult,
	type KrpcMessage,
	type PingResult,
} from '$/sources/BitTorrent/Dht/types.ts'

const textDecoder = new TextDecoder()

const assertNodeIdLength = (
	nodeId: Uint8Array,
	label: string
) => {
	if (nodeId.byteLength !== dhtNodeIdLength)
		throw new Error(`BitTorrent_Dht: ${label} must be ${dhtNodeIdLength} bytes`)
	return nodeId
}

const assertByteString = (
	value: unknown,
	label: string,
	expectedByteLength?: number
) => {
	if (!(value instanceof Uint8Array))
		throw new Error(`BitTorrent_Dht: ${label} must be a byte string`)
	if (expectedByteLength != null && value.byteLength !== expectedByteLength)
		throw new Error(`BitTorrent_Dht: ${label} must be ${expectedByteLength} bytes`)
	return value
}

const assertBencodeObject = (
	value: unknown,
	label: string
): { [key: string]: BencodeValue | undefined } => {
	if (!(value instanceof Object) || value instanceof Uint8Array || value instanceof Array || Number.isSafeInteger(value))
		throw new Error(`BitTorrent_Dht: ${label} must be a bencode dict`)
	return value as { [key: string]: BencodeValue | undefined }
}

const assertSequence = (
	value: unknown
) => {
	if (!Number.isSafeInteger(value) || Number(value) < 0)
		throw new Error('BitTorrent_Dht: seq must be a non-negative safe integer')
	return Number(value)
}

const bytesEqual = (
	left: Uint8Array,
	right: Uint8Array
) => {
	if (left.byteLength !== right.byteLength)
		return false
	for (let index = 0; index < left.byteLength; index++) {
		if (left[index] !== right[index])
			return false
	}
	return true
}

const sha1 = (bytes: Uint8Array) => (
	new Uint8Array(createHash('sha1').update(bytes).digest())
)

const concatenateBytes = (...values: Uint8Array[]) => {
	const result = new Uint8Array(values.reduce((length, value) => length + value.byteLength, 0))
	let offset = 0
	for (const value of values) {
		result.set(value, offset)
		offset += value.byteLength
	}
	return result
}

const validateBep44Value = ({
	target,
	value,
	publicKey,
	signature,
	sequence,
	salt,
}: {
	target: Uint8Array
	value: BencodeValue | undefined
	publicKey: Uint8Array | undefined
	signature: Uint8Array | undefined
	sequence: number | undefined
	salt: Uint8Array
}) => {
	if (value === undefined) {
		if (publicKey !== undefined || signature !== undefined)
			throw new Error('BitTorrent_Dht: incomplete mutable item response')
		return
	}
	if (publicKey === undefined && signature === undefined && sequence === undefined) {
		if (!bytesEqual(sha1(encodeBencode(value)), target))
			throw new Error('BitTorrent_Dht: immutable item hash does not match target')
		return
	}
	if (publicKey === undefined || signature === undefined || sequence === undefined)
		throw new Error('BitTorrent_Dht: incomplete mutable item response')
	if (!bytesEqual(sha1(concatenateBytes(publicKey, salt)), target))
		throw new Error('BitTorrent_Dht: mutable item public key does not match target')
	const signable = concatenateBytes(
		salt.byteLength === 0 ? new Uint8Array(0) : encodeBencode({ salt }).subarray(1, -1),
		new TextEncoder().encode(`3:seqi${sequence}e1:v`),
		encodeBencode(value)
	)
	if (!ed25519.verify(signature, signable, publicKey))
		throw new Error('BitTorrent_Dht: mutable item signature is invalid')
}

const parseIpv4Port = (
	bytes: Uint8Array,
	offset: number
): CompactPeerInfo => ({
	host: `${bytes[offset]}.${bytes[offset + 1]}.${bytes[offset + 2]}.${bytes[offset + 3]}`,
	port: (bytes[offset + 4] << 8) | bytes[offset + 5],
})

const parseCompactNodeInfos = (
	bytes: Uint8Array
): CompactNodeInfo[] => {
	if (bytes.byteLength % 26 !== 0)
		throw new Error(`BitTorrent_Dht: compact node info length ${bytes.byteLength} is not a multiple of 26`)
	const nodes: CompactNodeInfo[] = []
	for (let offset = 0; offset < bytes.byteLength; offset += 26)
		nodes.push({
			nodeId: bytes.subarray(offset, offset + 20),
			...parseIpv4Port(bytes, offset + 20),
		})
	return nodes
}

const parseCompactPeerInfos = (
	bytes: Uint8Array
): CompactPeerInfo[] => {
	if (bytes.byteLength % 6 !== 0)
		throw new Error(`BitTorrent_Dht: compact peer info length ${bytes.byteLength} is not a multiple of 6`)
	const peers: CompactPeerInfo[] = []
	for (let offset = 0; offset < bytes.byteLength; offset += 6)
		peers.push(parseIpv4Port(bytes, offset))
	return peers
}

const encodeKrpcQuery = ({
	transactionId,
	queryKind,
	nodeId,
	argumentsDict,
}: {
	transactionId: Uint8Array
	queryKind: DhtQueryKind
	nodeId: Uint8Array
	argumentsDict: { [key: string]: BencodeValue }
}): Uint8Array => (
	encodeBencode({
		t: transactionId,
		y: 'q',
		q: queryKind,
		v: 'BH01',
		a: {
			id: nodeId,
			...argumentsDict,
		},
	})
)

const roundTrip = ({
	socket,
	remote,
	message,
	timeoutMs,
}: {
	socket: DhtSocket
	remote: DhtRemote
	message: Uint8Array
	timeoutMs: number
}): Promise<Uint8Array> => (
	new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error(`BitTorrent_Dht: query to ${remote.host}:${remote.port} timed out after ${timeoutMs}ms`))
		}, timeoutMs)
		socket.onMessage((bytes) => {
			clearTimeout(timer)
			resolve(bytes)
		})
		socket.onError((error) => {
			clearTimeout(timer)
			reject(error)
		})
		socket.send(message, remote)
	})
)

const parseKrpcResponse = ({
	transactionId,
	response,
}: {
	transactionId: Uint8Array
	response: Uint8Array
}) => {
	let decoded: unknown
	try {
		decoded = decodeBencode(response)
	} catch {
		throw new Error('BitTorrent_Dht: invalid KRPC response bencode')
	}
	let envelope: KrpcMessage
	try {
		envelope = krpcMessageWire.assert(decoded)
	} catch {
		throw new Error('BitTorrent_Dht: invalid KRPC response envelope')
	}
	const responseTransactionId = assertByteString(envelope.t, 'transaction id')
	if (!bytesEqual(responseTransactionId, transactionId))
		throw new Error('BitTorrent_Dht: KRPC transaction id mismatch')
	const messageKind = textDecoder.decode(assertByteString(envelope.y, 'message kind', 1))
	if (messageKind === 'e') {
		if (envelope.e == null)
			throw new Error('BitTorrent_Dht: KRPC error without error tuple')
		const [code, description] = envelope.e
		throw new Error(`BitTorrent_Dht: KRPC error ${code}: ${textDecoder.decode(assertByteString(description, 'error message'))}`)
	}
	if (messageKind !== 'r')
		throw new Error('BitTorrent_Dht: expected a KRPC response')
	const values = assertBencodeObject(envelope.r, 'response values')
	return {
		remoteNodeId: assertByteString(values.id, 'node id', dhtNodeIdLength),
		values,
	}
}

const queryOnce = async ({
	remote,
	transactionId,
	queryKind,
	nodeId,
	argumentsDict,
	timeoutMs,
}: {
	remote: DhtRemote
	transactionId: Uint8Array
	queryKind: DhtQueryKind
	nodeId: Uint8Array
	argumentsDict: { [key: string]: BencodeValue }
	timeoutMs: number
}) => {
	if (!Number.isInteger(remote.port) || remote.port < 1 || remote.port > 65535)
		throw new Error(`BitTorrent_Dht: invalid remote port ${remote.port}`)
	const socket = createDhtSocket()
	try {
		const response = await roundTrip({
			socket,
			remote,
			message: encodeKrpcQuery({
				transactionId,
				queryKind,
				nodeId,
				argumentsDict,
			}),
			timeoutMs,
		})
		return parseKrpcResponse({ transactionId, response })
	} finally {
		socket.close()
	}
}

export const ping = async ({
	remote,
	nodeId,
	timeoutMs = 15_000,
}: {
	remote: DhtRemote
	nodeId: Uint8Array
	timeoutMs?: number
}): Promise<PingResult> => {
	const transactionId = randomBytes(2)
	const { remoteNodeId } = await queryOnce({
		remote,
		transactionId,
		queryKind: 'ping',
		nodeId: assertNodeIdLength(nodeId, 'node id'),
		argumentsDict: {},
		timeoutMs,
	})
	return { remoteNodeId }
}

export const findNode = async ({
	remote,
	nodeId,
	target,
	timeoutMs = 15_000,
}: {
	remote: DhtRemote
	nodeId: Uint8Array
	target: Uint8Array
	timeoutMs?: number
}): Promise<FindNodeResult> => {
	const transactionId = randomBytes(2)
	const { remoteNodeId, values } = await queryOnce({
		remote,
		transactionId,
		queryKind: 'find_node',
		nodeId: assertNodeIdLength(nodeId, 'node id'),
		argumentsDict: {
			target: assertNodeIdLength(target, 'target'),
		},
		timeoutMs,
	})
	return {
		remoteNodeId,
		nodes: parseCompactNodeInfos(
			assertByteString(values.nodes, 'nodes')
		),
	}
}

export const getPeers = async ({
	remote,
	nodeId,
	infoHash,
	timeoutMs = 15_000,
}: {
	remote: DhtRemote
	nodeId: Uint8Array
	infoHash: Uint8Array
	timeoutMs?: number
}): Promise<GetPeersResult> => {
	const transactionId = randomBytes(2)
	const { remoteNodeId, values } = await queryOnce({
		remote,
		transactionId,
		queryKind: 'get_peers',
		nodeId: assertNodeIdLength(nodeId, 'node id'),
		argumentsDict: {
			info_hash: assertNodeIdLength(infoHash, 'info hash'),
		},
		timeoutMs,
	})
	const token = assertByteString(values.token, 'token')
	const peerByteStrings = values.values ?? []
	if (!(peerByteStrings instanceof Array))
		throw new Error('BitTorrent_Dht: peer values must be a list of byte strings')
	const peers: CompactPeerInfo[] = []
	for (const peerBytes of peerByteStrings)
		peers.push(...parseCompactPeerInfos(assertByteString(peerBytes, 'peer info')))
	return {
		remoteNodeId,
		token,
		peers,
		nodes: parseCompactNodeInfos(
			assertByteString(values.nodes ?? new Uint8Array(0), 'nodes')
		),
	}
}

export const get = async ({
	remote,
	nodeId,
	target,
	seq,
	salt = new Uint8Array(0),
	timeoutMs = 15_000,
}: {
	remote: DhtRemote
	nodeId: Uint8Array
	target: Uint8Array
	seq?: number
	salt?: Uint8Array
	timeoutMs?: number
}): Promise<GetResult> => {
	if (salt.byteLength > 64)
		throw new Error('BitTorrent_Dht: salt must not exceed 64 bytes')
	if (seq !== undefined)
		assertSequence(seq)
	const transactionId = randomBytes(2)
	const { remoteNodeId, values } = await queryOnce({
		remote,
		transactionId,
		queryKind: 'get',
		nodeId: assertNodeIdLength(nodeId, 'node id'),
		argumentsDict: {
			target: assertNodeIdLength(target, 'target'),
			...(seq !== undefined && { seq }),
		},
		timeoutMs,
	})
	const value = values.v
	const publicKey = values.k === undefined ? undefined : assertByteString(values.k, 'public key', dhtPublicKeyLength)
	const signature = values.sig === undefined ? undefined : assertByteString(values.sig, 'signature', dhtSignatureLength)
	const sequence = values.seq === undefined ? undefined : assertSequence(values.seq)
	const token = assertByteString(values.token, 'token')
	validateBep44Value({ target, value, publicKey, signature, sequence, salt })
	return {
		remoteNodeId,
		token,
		nodes: parseCompactNodeInfos(
			assertByteString(values.nodes ?? new Uint8Array(0), 'nodes')
		),
		...(value !== undefined && { value }),
		...(publicKey !== undefined && { publicKey }),
		...(signature !== undefined && { signature }),
		...(sequence !== undefined && { sequence }),
	}
}

const udpLocatorPattern = /^udp:\/\/([^:/]+):(\d+)$/

export const parseDhtIdHex = (
	hex: string,
	label: string
) => {
	const normalized = hex.toLowerCase()
	if (!/^[0-9a-f]{40}$/.test(normalized))
		throw new Error(`BitTorrent_Dht: ${label} must be 20-byte hex`)
	return Uint8Array.from({ length: 20 }, (_, index) => (
		Number.parseInt(normalized.slice(index * 2, index * 2 + 2), 16)
	))
}

export const createRandomNodeId = () => (
	assertNodeIdLength(randomBytes(dhtNodeIdLength), 'node id')
)

export const normalizeDhtIdHex = (
	nodeId: Uint8Array
) => (
	[...assertNodeIdLength(nodeId, 'node id')]
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('')
)

export const mainlineDhtBootstrapRemotes = bindings[Source.BitTorrent]
	.filter((binding) => binding.target.key === 'mainline-dht')
	.flatMap((binding) => binding.endpoints.map((endpoint) => {
		const match = udpLocatorPattern.exec(endpoint.locator)
		if (match == null)
			throw new Error(`BitTorrent_Dht: invalid bootstrap locator ${endpoint.locator}`)
		return {
			host: match[1],
			port: Number(match[2]),
		}
	}))
