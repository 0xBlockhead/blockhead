import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/qBittorrentWebUi/bindings.ts'
import type {
	QBittorrentTorrentFile,
	QBittorrentTorrentInfo,
	QBittorrentTorrentPeer,
	QBittorrentTorrentTracker,
} from '$/sources/qBittorrentWebUi/Rest/queries.ts'


const loadQBittorrentQueries = async () => {
	const binding = bindings[Source.qBittorrentWebUi_Rest][0]
	if (typeof window !== 'undefined') {
		const queries = await import('$/sources/qBittorrentWebUi/Rest/queries.remote.ts')
		return {
			getApplicationPreferences: () => queries.getApplicationPreferences(),
			getApplicationVersion: () => queries.getApplicationVersion(),
			getTorrentFiles: (infoHash: string) => queries.getTorrentFiles({ infoHash }),
			getTorrentPeers: (infoHash: string) => queries.getTorrentPeers({ infoHash }),
			getTorrentPieceStates: (infoHash: string) => queries.getTorrentPieceStates({ infoHash }),
			getTorrentProperties: (infoHash: string) => queries.getTorrentProperties({ infoHash }),
			getTorrentTrackers: (infoHash: string) => queries.getTorrentTrackers({ infoHash }),
			getTorrentsInfo: () => queries.getTorrentsInfo(),
			getTransferInfo: () => queries.getTransferInfo(),
		}
	}

	const queries = await import('$/sources/qBittorrentWebUi/Rest/queries.ts')
	return {
		getApplicationPreferences: () => queries.getApplicationPreferences(binding),
		getApplicationVersion: () => queries.getApplicationVersion(binding),
		getTorrentFiles: (infoHash: string) => queries.getTorrentFiles(binding, infoHash),
		getTorrentPeers: (infoHash: string) => queries.getTorrentPeers(binding, infoHash),
		getTorrentPieceStates: (infoHash: string) => queries.getTorrentPieceStates(binding, infoHash),
		getTorrentProperties: (infoHash: string) => queries.getTorrentProperties(binding, infoHash),
		getTorrentTrackers: (infoHash: string) => queries.getTorrentTrackers(binding, infoHash),
		getTorrentsInfo: () => queries.getTorrentsInfo(binding),
		getTransferInfo: () => queries.getTransferInfo(binding),
	}
}


const clientId = 'qbittorrent-local'
const clientSelector = { clientId }

const normalizedTorrentIdentity = ({
	infoHash,
	hashVersion,
}: {
	infoHash: string
	hashVersion: string
}) => {
	const normalizedInfoHash = infoHash.toLowerCase()
	if (
		(hashVersion === 'v1' && !/^[0-9a-f]{40}$/.test(normalizedInfoHash))
		|| (hashVersion === 'v2' && !/^[0-9a-f]{64}$/.test(normalizedInfoHash))
		|| (hashVersion !== 'v1' && hashVersion !== 'v2')
	)
		throw new Error('qBittorrentWebUi_Rest: invalid torrent identity')

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
		throw new Error(`qBittorrentWebUi_Rest: ${field} exceeds the safe integer range`)

	return BigInt(value)
}

const transferReference = (
	torrent: QBittorrentTorrentInfo,
	timestampMs: number,
	selectedFileIndexes: number[],
	filePriorities: number[] | undefined,
	verifiedPieces: number
) => {
	const infoHash = torrent.hash.toLowerCase()
	const $torrent = {
		infoHash,
		hashVersion: infoHash.length === 40 ? 'v1' : 'v2',
	}

	return {
		[EntityMetaKey.Selector]: {
			$client: clientSelector,
			$torrent: $torrent,
			timestampMs,
		},
		[EntityMetaKey.Fields]: {
			...(torrent.state != null && {
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'status')]: torrent.state,
			}),
			...(torrent.save_path != null && {
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'savePath')]: torrent.save_path,
			}),
		[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'selectedFileIndexes')]: selectedFileIndexes,
		...(filePriorities != null && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'filePriorities')]: filePriorities,
		}),
		...(torrent.priority != null && torrent.priority >= 0 && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'queuePosition')]: torrent.priority,
		}),
		...(torrent.ratio != null && {
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'ratio')]: torrent.ratio,
		}),
			...(torrent.downloaded != null && {
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'downloadedBytes')]: byteCount(torrent.downloaded, 'torrent downloaded bytes'),
			}),
			...(torrent.uploaded != null && {
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'uploadedBytes')]: byteCount(torrent.uploaded, 'torrent uploaded bytes'),
			}),
			...(torrent.dlspeed != null && {
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'downloadRate')]: torrent.dlspeed,
			}),
			...(torrent.upspeed != null && {
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'uploadRate')]: torrent.upspeed,
			}),
			...(torrent.num_seeds != null && torrent.num_leechs != null && {
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'connectedPeerCount')]: torrent.num_seeds + torrent.num_leechs,
			}),
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'verifiedPieces')]: verifiedPieces,
		},
	}
}

const torrentFileFields = (
	file: QBittorrentTorrentFile
) => {
	const pathSegments = file.name.split('/')
	if (pathSegments.some((segment) => segment === '' || segment === '.' || segment === '..'))
		throw new Error('qBittorrentWebUi_Rest: unsafe torrent file path')

	return {
		path: file.name,
		pathSegments,
		length: byteCount(file.size, 'torrent file size'),
	}
}

const torrentFileReference = (
	$torrent: {
		infoHash: string
		hashVersion: string
	},
	file: QBittorrentTorrentFile
) => {
	const fields = torrentFileFields(file)

	return {
		[EntityMetaKey.Selector]: {
			$torrent,
			fileIndex: file.index,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BitTorrentFile, [], 'path')]: fields.path,
			[entityFieldAddressKey(EntityType.BitTorrentFile, [], 'pathSegments')]: fields.pathSegments,
			[entityFieldAddressKey(EntityType.BitTorrentFile, [], 'length')]: fields.length,
		},
	}
}

const torrentPieceReferences = (
	$torrent: {
		infoHash: string
		hashVersion: string
	},
	pieceStates: (0 | 1 | 2)[],
	pieceSize: number,
	totalSize: number
) => {
	if (
		(pieceStates.length === 0 && totalSize !== 0)
		|| (pieceStates.length > 0 && (
			pieceSize === 0
			|| Math.ceil(totalSize / pieceSize) !== pieceStates.length
		))
	)
		throw new Error('qBittorrentWebUi_Rest: inconsistent torrent piece geometry')

	return pieceStates.map((_pieceState, pieceIndex) => ({
		[EntityMetaKey.Selector]: {
			$torrent,
			pieceIndex,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BitTorrentPiece, [], 'offset')]: BigInt(pieceIndex) * BigInt(pieceSize),
			[entityFieldAddressKey(EntityType.BitTorrentPiece, [], 'length')]: BigInt(
				pieceIndex === pieceStates.length - 1 ?
					totalSize - pieceSize * pieceIndex
				:
					pieceSize
			),
		},
	}))
}

const trackerStatusByCode = {
	0: 'disabled',
	1: 'not-contacted',
	2: 'working',
	3: 'updating',
	4: 'not-working',
} as const

const torrentTrackerReferences = (
	$torrent: {
		infoHash: string
		hashVersion: string
	},
	trackers: QBittorrentTorrentTracker[],
	timestampMs: number
) => trackers.flatMap((tracker) => {
	let trackerUrl: URL
	try {
		trackerUrl = new URL(tracker.url)
	} catch {
		return []
	}
	if (
		trackerUrl.username !== ''
		|| trackerUrl.password !== ''
		|| trackerUrl.hash !== ''
		|| ![
			'http:',
			'https:',
			'udp:',
		].includes(trackerUrl.protocol)
	)
		return []

	const normalizedTrackerUrl = trackerUrl.toString()
	return [{
		[EntityMetaKey.Selector]: {
			trackerUrl: normalizedTrackerUrl,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BitTorrentTracker, [], 'trackerKind')]: trackerUrl.protocol.slice(0, -1),
			[entityFieldAddressKey(EntityType.BitTorrentTracker, [], '$$scrapes')]: [{
				[EntityMetaKey.Selector]: {
					$tracker: { trackerUrl: normalizedTrackerUrl },
					infoHash: $torrent.infoHash,
					timestampMs,
					source: Source.qBittorrentWebUi_Rest,
				},
				[EntityMetaKey.Fields]: {
					...(tracker.num_seeds != null && tracker.num_seeds >= 0 && {
						[entityFieldAddressKey(EntityType.BitTorrentTrackerScrape_Timestamp, [], 'complete')]: tracker.num_seeds,
					}),
					...(tracker.num_downloaded != null && tracker.num_downloaded >= 0 && {
						[entityFieldAddressKey(EntityType.BitTorrentTrackerScrape_Timestamp, [], 'downloaded')]: tracker.num_downloaded,
					}),
					...(tracker.num_leeches != null && tracker.num_leeches >= 0 && {
						[entityFieldAddressKey(EntityType.BitTorrentTrackerScrape_Timestamp, [], 'incomplete')]: tracker.num_leeches,
					}),
					[entityFieldAddressKey(EntityType.BitTorrentTrackerScrape_Timestamp, [], 'status')]: (
						tracker.status == null ?
							'unknown'
						:
							trackerStatusByCode[tracker.status]
					),
					...(tracker.msg != null && tracker.msg !== '' && tracker.status === 4 && {
						[entityFieldAddressKey(EntityType.BitTorrentTrackerScrape_Timestamp, [], 'error')]: tracker.msg,
					}),
				},
			}],
		},
	}]
})

const torrentPeerReferences = (
	$torrent: {
		infoHash: string
		hashVersion: string
	},
	peers: [string, QBittorrentTorrentPeer][],
	timestampMs: number
) => peers.map(([peerId, peer]) => ({
	[EntityMetaKey.Selector]: {
		$torrent,
		peerId,
		timestampMs,
		source: Source.qBittorrentWebUi_Rest,
	},
	[EntityMetaKey.Fields]: {
		...(peer.ip != null && {
			[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'address')]: peer.ip,
		}),
		...(peer.port != null && {
			[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'port')]: peer.port,
		}),
		...(peer.client != null && peer.client !== '' && {
			[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'client')]: peer.client,
		}),
		...(peer.progress != null && {
			[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'completedPercent')]: peer.progress * 100,
		}),
	},
}))

export default {
	source: Source.qBittorrentWebUi_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.BitTorrentFile,
			resolve: {
				TorrentFileIndex: {
					resolve: async ({ $torrent: torrentIdentity, fileIndex }) => {
						const $torrent = normalizedTorrentIdentity(torrentIdentity)
						const { getTorrentFiles } = await loadQBittorrentQueries()
						const file = (await getTorrentFiles($torrent.infoHash))
							.find((candidate) => candidate.index === fileIndex)
						if (file == null)
							throw new Error('qBittorrentWebUi_Rest: torrent file not found')

						return {
							$torrent,
							fileIndex,
							...torrentFileFields(file),
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
					resolve: async (torrentIdentity, context) => {
						const { infoHash: normalizedInfoHash, hashVersion } = normalizedTorrentIdentity(torrentIdentity)
						const { getTorrentFiles, getTorrentPeers, getTorrentPieceStates, getTorrentProperties, getTorrentTrackers, getTorrentsInfo } = await loadQBittorrentQueries()
						const torrents = await getTorrentsInfo()
						const torrent = torrents.find((candidate) => candidate.hash.toLowerCase() === normalizedInfoHash)
						if (torrent == null)
							throw new Error('qBittorrentWebUi_Rest: torrent not found in the configured local client')

						const [files, peers, pieceStates, properties, trackers] = await Promise.all([
							getTorrentFiles(normalizedInfoHash),
							getTorrentPeers(normalizedInfoHash),
							getTorrentPieceStates(normalizedInfoHash),
							getTorrentProperties(normalizedInfoHash),
							getTorrentTrackers(normalizedInfoHash),
						])
						const $torrent = {
							infoHash: normalizedInfoHash,
							hashVersion,
						}
						const timestampMs = Date.now()

						return {
							...$torrent,
							name: torrent.name,
							...(properties.piece_size != null && {
								pieceLength: byteCount(properties.piece_size, 'torrent piece length'),
							}),
							...(properties.total_size != null && {
								totalLength: byteCount(properties.total_size, 'torrent total length'),
							}),
							$$files: files.map((file) => torrentFileReference($torrent, file)),
							$$pieces: (
								properties.piece_size == null || properties.total_size == null ?
									[]
								:
									torrentPieceReferences($torrent, pieceStates, properties.piece_size, properties.total_size)
							),
							$$trackers: torrentTrackerReferences($torrent, trackers, timestampMs),
							$$peerTimestamps: torrentPeerReferences(
								$torrent,
								Object.entries(peers.peers ?? {}).slice(0, resolverContextRowLimit(context)),
								timestampMs
							),
							$$swarmTimestamps: [
								{
									[EntityMetaKey.Selector]: {
										$torrent,
										timestampMs,
										source: Source.qBittorrentWebUi_Rest,
									},
									[EntityMetaKey.Fields]: {
										...(torrent.num_seeds != null && torrent.num_leechs != null && {
											[entityFieldAddressKey(EntityType.BitTorrentSwarmObservation_Timestamp, [], 'peerCount')]:
												torrent.num_seeds + torrent.num_leechs,
										}),
										...(torrent.num_seeds != null && {
											[entityFieldAddressKey(EntityType.BitTorrentSwarmObservation_Timestamp, [], 'seedCount')]:
												torrent.num_seeds,
										}),
									},
								},
							],
							$$clientTransfers: [transferReference(
								torrent,
								timestampMs,
								files.flatMap((file) => file.priority === 0 ? [] : [file.index]),
								files.every((file) => file.priority != null) ? files.map((file) => file.priority ?? 0) : undefined,
								pieceStates.filter((pieceState) => pieceState === 2).length
							)],
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
			$$files: {
				select: (torrent) => torrent.$$files,
				resolveCount: (torrent) => torrent.$$files.length,
			},
			$$pieces: {
				select: (torrent) => torrent.$$pieces,
				resolveCount: (torrent) => torrent.$$pieces.length,
			},
			$$trackers: {
				select: (torrent) => torrent.$$trackers,
				resolveCount: (torrent) => torrent.$$trackers.length,
			},
			$$peerTimestamps: (torrent) => torrent.$$peerTimestamps,
			$$swarmTimestamps: {
				select: (torrent) => torrent.$$swarmTimestamps,
				resolveCount: (torrent) => torrent.$$swarmTimestamps.length,
			},
			$$clientTransfers: {
				select: (torrent) => torrent.$$clientTransfers,
				resolveCount: (torrent) => torrent.$$clientTransfers.length,
			},
		}),

		defineResolver({
			entityType: EntityType.BlockheadBitTorrentClientState,
			resolve: {
				ClientId: {
					resolve: async ({ clientId: requestedClientId }, context) => {
						if (requestedClientId !== clientId)
							throw new Error(`qBittorrentWebUi_Rest: unknown local client ${requestedClientId}`)

						const { getApplicationPreferences, getApplicationVersion, getTorrentFiles, getTorrentPieceStates, getTorrentsInfo, getTransferInfo } = await loadQBittorrentQueries()
						const [clientPreferences, clientVersion, torrents, transfer] = await Promise.all([
							getApplicationPreferences(),
							getApplicationVersion(),
							getTorrentsInfo(),
							getTransferInfo(),
						])
						const selectedTorrents = torrents.slice(0, resolverContextRowLimit(context))
						const selectedTorrentFilesAndPieceStates = await Promise.all(selectedTorrents.map((torrent) => (
							Promise.all([
								getTorrentFiles(torrent.hash),
								getTorrentPieceStates(torrent.hash),
							])
						)))
						const timestampMs = Date.now()
						const downloadedBytes = transfer.dl_info_data == null ? undefined : byteCount(transfer.dl_info_data, 'session downloaded bytes')
						const uploadedBytes = transfer.up_info_data == null ? undefined : byteCount(transfer.up_info_data, 'session uploaded bytes')

						return {
							clientId,
							clientName: 'qBittorrent',
							$$transfers: selectedTorrents.map((torrent, torrentIndex) => {
								const [files, pieceStates] = selectedTorrentFilesAndPieceStates[torrentIndex]
								return transferReference(
									torrent,
									timestampMs,
									files.flatMap((file) => file.priority === 0 ? [] : [file.index]),
									files.every((file) => file.priority != null) ? files.map((file) => file.priority ?? 0) : undefined,
									pieceStates.filter((pieceState) => pieceState === 2).length
								)
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$clientState: clientSelector,
									timestampMs,
									source: Source.qBittorrentWebUi_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'clientVersion')]: clientVersion,
									[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'listenAddresses')]: (
										clientPreferences.current_interface_address == null
										|| clientPreferences.current_interface_address === '' ?
											[]
										:
											[clientPreferences.current_interface_address]
									),
									...(clientPreferences.listen_port != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'port')]: clientPreferences.listen_port,
									}),
									...(transfer.dl_info_speed != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'downloadRate')]: transfer.dl_info_speed,
									}),
									...(transfer.up_info_speed != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'uploadRate')]: transfer.up_info_speed,
									}),
									...(downloadedBytes != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'downloadedBytes')]: downloadedBytes,
									}),
									...(uploadedBytes != null && {
										[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'uploadedBytes')]: uploadedBytes,
									}),
									[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'activeTorrentCount')]: torrents.filter((torrent) => (
										(torrent.dlspeed ?? 0) > 0
										|| (torrent.upspeed ?? 0) > 0
									)).length,
									[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'lastSyncedAt')]: timestampMs,
								},
							}],
						}
					},
				},
			},
		})({
			clientId: (state) => state.clientId,
			clientName: (state) => state.clientName,
			$$transfers: (state) => state.$$transfers,
			$$timestamps: (state) => state.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule
