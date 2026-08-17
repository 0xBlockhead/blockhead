import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	CompactNodeInfo,
	DhtRemote,
	GetPeersResult,
} from '$/sources/BitTorrent/Dht/types.ts'

type TorrentSelector = {
	infoHash: string
	hashVersion: string
}

const dhtNodeTimestampFromCompactNode = ({
	nodeIdHex,
	timestampMs,
	host,
	port,
	reachable,
}: {
	nodeIdHex: string
	timestampMs: number
	host: string
	port: number
	reachable?: boolean
}) => ({
	[EntityMetaKey.Selector]: {
		nodeId: nodeIdHex,
		timestampMs,
		source: Source.BitTorrent,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BitTorrentDhtNode_Timestamp, [], 'address')]: host,
		[entityFieldAddressKey(EntityType.BitTorrentDhtNode_Timestamp, [], 'port')]: port,
		...(reachable != null && {
			[entityFieldAddressKey(EntityType.BitTorrentDhtNode_Timestamp, [], 'reachable')]: reachable,
		}),
	},
})

const dhtLookupRowFromGetPeers = ({
	$torrent,
	timestampMs,
	queriedNodeCount,
	remote,
	result,
	formatDhtIdHex,
}: {
	$torrent: TorrentSelector
	timestampMs: number
	queriedNodeCount: number
	remote: DhtRemote
	result: GetPeersResult
	formatDhtIdHex: typeof import('$/sources/BitTorrent/Dht/queries.ts').normalizeDhtIdHex
}) => {
	const nodesById = new Map<string, CompactNodeInfo & { reachable?: boolean }>()
	for (const node of result.nodes) {
		nodesById.set(formatDhtIdHex(node.nodeId), node)
	}
	nodesById.set(formatDhtIdHex(result.remoteNodeId), {
		nodeId: result.remoteNodeId,
		host: remote.host,
		port: remote.port,
		reachable: true,
	})
	return {
		[EntityMetaKey.Selector]: {
			$torrent,
			timestampMs,
			source: Source.BitTorrent,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'queriedNodeCount')]: queriedNodeCount,
			[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'responsiveNodeCount')]: 1,
			[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'peerCount')]: result.peers.length,
			[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'status')]: 'answered',
			[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], '$$closestNodes')]: (
				[...nodesById.entries()].map(([nodeIdHex, node]) => (
					dhtNodeTimestampFromCompactNode({
						nodeIdHex,
						timestampMs,
						host: node.host,
						port: node.port,
						reachable: node.reachable,
					})
				))
			),
		},
	}
}

const resolveDhtLookups = async ({
	infoHash,
	hashVersion,
}: TorrentSelector) => {
	if (hashVersion !== 'v1')
		throw new Error('BitTorrent_Dht: get_peers requires a v1 20-byte info hash')
	const {
		createRandomNodeId,
		normalizeDhtIdHex,
		getPeers,
		mainlineDhtBootstrapRemotes,
		parseDhtIdHex,
	} = await import('$/sources/BitTorrent/Dht/queries.ts')
	if (mainlineDhtBootstrapRemotes.length === 0)
		throw new Error('BitTorrent_Dht: no mainline DHT bootstrap remotes')
	const infoHashBytes = parseDhtIdHex(infoHash, 'info hash')
	const nodeId = createRandomNodeId()
	const $torrent = {
		infoHash: infoHash.toLowerCase(),
		hashVersion,
	}
	let queriedNodeCount = 0
	let lastError: unknown
	for (const remote of mainlineDhtBootstrapRemotes) {
		queriedNodeCount += 1
		try {
			const result = await getPeers({
				remote,
				nodeId,
				infoHash: infoHashBytes,
			})
			return [
				dhtLookupRowFromGetPeers({
					$torrent,
					timestampMs: Date.now(),
					queriedNodeCount,
					remote,
					result,
					formatDhtIdHex: normalizeDhtIdHex,
				}),
			]
		} catch (error) {
			lastError = error
		}
	}
	throw lastError instanceof Error ?
		lastError
	:
		new Error('BitTorrent_Dht: get_peers failed')
}

export default {
	source: Source.BitTorrent,

	resolvers: [
		defineResolver({
			entityType: EntityType.BitTorrentMetainfo,
			resolve: {
				InfoHashHashVersion: {
					resolve: async ({
						infoHash,
						hashVersion,
					}) => ({
						infoHash: infoHash.toLowerCase(),
						hashVersion,
					}),
				},
			},
		})({
			infoHash: (torrent) => torrent.infoHash,
			hashVersion: (torrent) => torrent.hashVersion,
			$$dhtLookups: {
				resolve: async ({
					infoHash,
					hashVersion,
				}) => (
					resolveDhtLookups({
						infoHash,
						hashVersion,
					})
				),
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
