/**
 * BitTorrent mainline DHT (BEP 5) KRPC wire shapes over bencode, plus BEP 44 `get`.
 * @see https://www.bittorrent.org/beps/bep_0005.html
 * @see https://www.bittorrent.org/beps/bep_0044.html
 */

import type { BencodeValue } from '$/sources/_shared/wire/Bencode/types.ts'

import { type as arktype } from 'arktype'

export const dhtNodeIdLength = 20

export const dhtPublicKeyLength = 32

export const dhtSignatureLength = 64

export type DhtNodeId = Uint8Array

export type DhtTransactionId = Uint8Array

export type DhtToken = Uint8Array

export type CompactPeerInfo = {
	host: string
	port: number
}

export type CompactNodeInfo = {
	nodeId: Uint8Array
	host: string
	port: number
}

export type DhtQueryKind = 'ping' | 'find_node' | 'get_peers' | 'get'

/** Decoded KRPC message envelope (byte strings stay `'unknown'` and are narrowed by the codec). */
export const krpcMessageWire = arktype({
	t: 'unknown',
	y: 'unknown',
	'v?': 'unknown',
	'q?': 'unknown',
	'a?': 'unknown',
	'r?': 'unknown',
	'e?': ['number', 'unknown'],
})

export type KrpcMessage = typeof krpcMessageWire.infer

export type PingResult = {
	remoteNodeId: DhtNodeId
}

export type FindNodeResult = {
	remoteNodeId: DhtNodeId
	nodes: CompactNodeInfo[]
}

export type GetPeersResult = {
	remoteNodeId: DhtNodeId
	token: DhtToken
	peers: CompactPeerInfo[]
	nodes: CompactNodeInfo[]
}

export type GetResult = {
	remoteNodeId: DhtNodeId
	token: DhtToken
	nodes: CompactNodeInfo[]
	value?: BencodeValue
	publicKey?: Uint8Array
	signature?: Uint8Array
	sequence?: number
}
