import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
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
import bindings from '$/sources/Transmission/bindings.ts'
import type {
	TransmissionTorrent,
	TransmissionTorrentFile,
	TransmissionTorrentPeer,
} from '$/sources/Transmission/Rpc/types.ts'


const loadTransmissionQueries = async () => {
	const binding = bindings[Source.TransmissionRpc_JsonRpc][0]
	if (typeof window !== 'undefined')
		return import('$/sources/Transmission/Rpc/queries.remote.ts')

	const queries = await import('$/sources/Transmission/Rpc/queries.ts')
	return {
		sessionGet: () => queries.sessionGet(binding),
		sessionStats: () => queries.sessionStats(binding),
		torrentGet: (fields: readonly string[]) => queries.torrentGet(binding, fields),
	}
}


const clientId = 'transmission-local'
const clientSelector = { clientId }
const torrentFields = [
	'hashString',
	'name',
	'status',
	'downloadDir',
	'downloadedEver',
	'uploadedEver',
	'rateDownload',
	'rateUpload',
	'peersConnected',
	'queuePosition',
	'uploadRatio',
	'errorString',
	'pieceCount',
	'pieceSize',
	'totalSize',
	'files',
	'fileStats',
	'peers',
] as const

const normalizedTorrent = (
	infoHash: string,
	hashVersion: string
) => {
	const normalizedInfoHash = infoHash.toLowerCase()
	if (hashVersion !== 'v1' || !/^[0-9a-f]{40}$/.test(normalizedInfoHash))
		throw new Error('TransmissionRpc_JsonRpc: invalid torrent identity')

	return {
		infoHash: normalizedInfoHash,
		hashVersion,
	}
}

const byteCount = (
	value: number,
	field: string
) => {
	if (!Number.isSafeInteger(value))
		throw new Error(`TransmissionRpc_JsonRpc: ${field} exceeds the safe integer range`)

	return BigInt(value)
}

const fileFields = (
	file: TransmissionTorrentFile
) => {
	const pathSegments = file.name.split('/')
	if (pathSegments.some((segment) => segment === '' || segment === '.' || segment === '..'))
		throw new Error('TransmissionRpc_JsonRpc: unsafe torrent file path')

	return {
		path: file.name,
		pathSegments,
		length: byteCount(file.length, 'torrent file length'),
	}
}

const torrentIdentity = (
	torrent: TransmissionTorrent
) => normalizedTorrent(torrent.hashString, 'v1')

const torrentFileReference = (
	$torrent: ReturnType<typeof torrentIdentity>,
	file: TransmissionTorrentFile,
	fileIndex: number
) => ({
	[EntityMetaKey.Selector]: {
		$torrent,
		fileIndex,
	},
	[EntityMetaKey.Fields]: Object.fromEntries(Object.entries(fileFields(file)).map(([fieldName, value]) => [
		entityFieldAddressKey(EntityType.BitTorrentFile, [], fieldName),
		value,
	])),
})

const torrentPieceReferences = (
	$torrent: ReturnType<typeof torrentIdentity>,
	pieceCount: number,
	pieceSize: number,
	totalSize: number
) => (
	Array.from({ length: pieceCount }, (_, pieceIndex) => ({
		[EntityMetaKey.Selector]: {
			$torrent,
			pieceIndex,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BitTorrentPiece, [], 'offset')]: BigInt(pieceIndex) * BigInt(pieceSize),
			[entityFieldAddressKey(EntityType.BitTorrentPiece, [], 'length')]: BigInt(
				pieceIndex === pieceCount - 1 ?
					totalSize - pieceSize * pieceIndex
				:
					pieceSize
			),
		},
	}))
)

const transferReference = (
	torrent: TransmissionTorrent,
	timestampMs: number
) => ({
	[EntityMetaKey.Selector]: {
		$client: clientSelector,
		$torrent: torrentIdentity(torrent),
		timestampMs,
	},
	[EntityMetaKey.Fields]: {
		...(torrent.status != null && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'status')]: [
				'stopped',
				'queued for verification',
				'verifying',
				'queued for download',
				'downloading',
				'queued for seeding',
				'seeding',
			][torrent.status],
		}),
		...(torrent.downloadDir != null && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'savePath')]: torrent.downloadDir,
		}),
		[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'selectedFileIndexes')]: (torrent.fileStats ?? []).flatMap((file, fileIndex) => file.wanted === false ? [] : [fileIndex]),
		...(torrent.fileStats?.every((file) => file.priority != null) && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'filePriorities')]: torrent.fileStats.map((file) => file.priority ?? 0),
		}),
		...(torrent.queuePosition != null && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'queuePosition')]: torrent.queuePosition,
		}),
		...(torrent.uploadRatio != null && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'ratio')]: torrent.uploadRatio,
		}),
		...(torrent.downloadedEver != null && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'downloadedBytes')]: byteCount(torrent.downloadedEver, 'downloaded bytes'),
		}),
		...(torrent.uploadedEver != null && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'uploadedBytes')]: byteCount(torrent.uploadedEver, 'uploaded bytes'),
		}),
		...(torrent.rateDownload != null && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'downloadRate')]: torrent.rateDownload,
		}),
		...(torrent.rateUpload != null && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'uploadRate')]: torrent.rateUpload,
		}),
		...(torrent.peersConnected != null && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'connectedPeerCount')]: torrent.peersConnected,
		}),
		...(torrent.errorString != null && torrent.errorString !== '' && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'error')]: torrent.errorString,
		}),
	},
})

const torrentPeerReference = (
	$torrent: ReturnType<typeof torrentIdentity>,
	peer: TransmissionTorrentPeer,
	timestampMs: number
) => ({
	[EntityMetaKey.Selector]: {
		$torrent,
		peerId: `${peer.address.includes(':') ? `[${peer.address}]` : peer.address}:${peer.port}`,
		timestampMs,
		source: Source.TransmissionRpc_JsonRpc,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'address')]: peer.address,
		[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'port')]: peer.port,
		...(peer.clientName != null && peer.clientName !== '' && {
			[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'client')]: peer.clientName,
		}),
		...(peer.progress != null && {
			[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'completedPercent')]: peer.progress * 100,
		}),
	},
})

export default {
	source: Source.TransmissionRpc_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.BitTorrentFile,
			resolve: {
				TorrentFileIndex: {
					resolve: async ({ $torrent: torrent, fileIndex }) => {
						const $torrent = normalizedTorrent(torrent.infoHash, torrent.hashVersion)
						const { torrentGet } = await loadTransmissionQueries()
						const resolvedTorrent = (await torrentGet(
							[...torrentFields]
						)).torrents.find((candidate) => candidate.hashString.toLowerCase() === $torrent.infoHash)
						const file = resolvedTorrent?.files?.[fileIndex]
						if (file == null)
							throw new Error('TransmissionRpc_JsonRpc: torrent file not found')

						return {
							$torrent,
							fileIndex,
							...fileFields(file),
						}
					},
				},
			},
		})({
			$torrent: (file) => file.$torrent,
			fileIndex: (file) => file.fileIndex,
			path: (file) => file.path,
			pathSegments: (file) => file.pathSegments,
			length: (file) => file.length,
		}),

		defineResolver({
			entityType: EntityType.BitTorrentMetainfo,
			resolve: {
				InfoHashHashVersion: {
					resolve: async ({ infoHash, hashVersion }, context) => {
						const $torrent = normalizedTorrent(infoHash, hashVersion)
						const { torrentGet } = await loadTransmissionQueries()
						const torrent = (await torrentGet(
							[...torrentFields]
						)).torrents.find((candidate) => candidate.hashString.toLowerCase() === $torrent.infoHash)
						if (torrent == null)
							throw new Error('TransmissionRpc_JsonRpc: torrent not found in the configured local client')
						const timestampMs = Date.now()

						return {
							...$torrent,
							...(torrent.name != null && { name: torrent.name }),
							...(torrent.pieceSize != null && { pieceLength: byteCount(torrent.pieceSize, 'piece size') }),
							...(torrent.totalSize != null && { totalLength: byteCount(torrent.totalSize, 'total size') }),
							$$files: (torrent.files ?? []).map((file, fileIndex) => torrentFileReference($torrent, file, fileIndex)),
							$$pieces: (
								torrent.pieceCount == null || torrent.pieceSize == null || torrent.totalSize == null ?
									[]
								:
									torrentPieceReferences($torrent, torrent.pieceCount, torrent.pieceSize, torrent.totalSize)
							),
							$$peerTimestamps: (torrent.peers ?? [])
								.slice(0, resolverContextRowLimit(context))
								.map((peer) => torrentPeerReference($torrent, peer, timestampMs)),
							$$swarmTimestamps: (
								torrent.peersConnected != null ?
									[
										{
											[EntityMetaKey.Selector]: {
												$torrent,
												timestampMs,
												source: Source.TransmissionRpc_JsonRpc,
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.BitTorrentSwarmObservation_Timestamp, [], 'peerCount')]: torrent.peersConnected,
											},
										},
									]
								:
									[]
							),
							$$clientTransfers: [transferReference(torrent, timestampMs)],
						}
					},
				},
			},
		})({
			infoHash: (torrent) => torrent.infoHash,
			hashVersion: (torrent) => torrent.hashVersion,
			name: (torrent) => torrent.name,
			pieceLength: (torrent) => torrent.pieceLength,
			totalLength: (torrent) => torrent.totalLength,
			$$files: (torrent) => torrent.$$files,
			$$pieces: (torrent) => torrent.$$pieces,
			$$peerTimestamps: (torrent) => torrent.$$peerTimestamps,
			$$swarmTimestamps: (torrent) => torrent.$$swarmTimestamps,
			$$clientTransfers: (torrent) => torrent.$$clientTransfers,
		}),

		defineResolver({
			entityType: EntityType.BlockheadBitTorrentClientState,
			resolve: {
				ClientId: {
					resolve: async ({ clientId: requestedClientId }, context) => {
						if (requestedClientId !== clientId)
							throw new Error(`TransmissionRpc_JsonRpc: unknown local client ${requestedClientId}`)

						const { sessionGet, sessionStats, torrentGet } = await loadTransmissionQueries()
						const [session, stats, torrents] = await Promise.all([
							sessionGet(),
							sessionStats(),
							torrentGet([...torrentFields]),
						])
						const timestampMs = Date.now()

						return {
							clientId,
							clientName: 'Transmission',
							$$transfers: torrents.torrents
								.slice(0, resolverContextRowLimit(context))
								.map((torrent) => transferReference(torrent, timestampMs)),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$clientState: clientSelector,
									timestampMs,
									source: Source.TransmissionRpc_JsonRpc,
								},
								[EntityMetaKey.Fields]: {
									...(session.version != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'clientVersion')]: session.version,
									}),
									[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'listenAddresses')]: [
										session['bind-address-ipv4'],
										session['bind-address-ipv6'],
									].filter((address) => address != null && address !== ''),
									...(session['peer-port'] != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'port')]: session['peer-port'],
									}),
									...(stats.downloadSpeed != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'downloadRate')]: stats.downloadSpeed,
									}),
									...(stats.uploadSpeed != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'uploadRate')]: stats.uploadSpeed,
									}),
									...(stats['cumulative-stats']?.downloadedBytes != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'downloadedBytes')]: byteCount(stats['cumulative-stats'].downloadedBytes, 'session downloaded bytes'),
									}),
									...(stats['cumulative-stats']?.uploadedBytes != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'uploadedBytes')]: byteCount(stats['cumulative-stats'].uploadedBytes, 'session uploaded bytes'),
									}),
									...(stats.activeTorrentCount != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'activeTorrentCount')]: stats.activeTorrentCount,
									}),
									[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'lastSyncedAt')]: timestampMs,
								},
							}],
						}
					},
				},
			},
		})({
			clientId: (client) => client.clientId,
			clientName: (client) => client.clientName,
			$$transfers: (client) => client.$$transfers,
			$$timestamps: (client) => client.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule
