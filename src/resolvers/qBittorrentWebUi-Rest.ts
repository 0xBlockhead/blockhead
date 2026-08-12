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
} from '$/sources/qBittorrentWebUi/Rest/queries.ts'


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
	verifiedPieces?: number
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
			[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'selectedFileIndexes')]: [],
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
			...(verifiedPieces != null && {
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'verifiedPieces')]: verifiedPieces,
			}),
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

export default {
	source: Source.qBittorrentWebUi_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.BitTorrentFile,
			resolve: {
				TorrentFileIndex: {
					resolve: async ({ $torrent: torrentIdentity, fileIndex }) => {
						const $torrent = normalizedTorrentIdentity(torrentIdentity)
						const { getTorrentFiles } = await (
							typeof window === 'undefined' ?
								import('$/sources/qBittorrentWebUi/Rest/queries.ts')
							:
								import('$/sources/qBittorrentWebUi/Rest/queries.remote.ts')
						)
						const file = (await getTorrentFiles(
							bindings[Source.qBittorrentWebUi_Rest][0],
							$torrent.infoHash
						)).find((candidate) => candidate.index === fileIndex)
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
					resolve: async (torrentIdentity) => {
						const { infoHash: normalizedInfoHash, hashVersion } = normalizedTorrentIdentity(torrentIdentity)
						const { getTorrentFiles, getTorrentProperties, getTorrentsInfo } = await (
							typeof window === 'undefined' ?
								import('$/sources/qBittorrentWebUi/Rest/queries.ts')
							:
								import('$/sources/qBittorrentWebUi/Rest/queries.remote.ts')
						)
						const binding = bindings[Source.qBittorrentWebUi_Rest][0]
						const torrents = await getTorrentsInfo(binding)
						const torrent = torrents.find((candidate) => candidate.hash.toLowerCase() === normalizedInfoHash)
						if (torrent == null)
							throw new Error('qBittorrentWebUi_Rest: torrent not found in the configured local client')

						const [files, properties] = await Promise.all([
							getTorrentFiles(binding, normalizedInfoHash),
							getTorrentProperties(binding, normalizedInfoHash),
						])
						const $torrent = {
							infoHash: normalizedInfoHash,
							hashVersion,
						}

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
		}),

		defineResolver({
			entityType: EntityType.BlockheadBitTorrentClientState,
			resolve: {
				ClientId: {
					resolve: async ({ clientId: requestedClientId }, context) => {
						if (requestedClientId !== clientId)
							throw new Error(`qBittorrentWebUi_Rest: unknown local client ${requestedClientId}`)

						const { getApplicationVersion, getTorrentPieceStates, getTorrentsInfo, getTransferInfo } = await (
							typeof window === 'undefined' ?
								import('$/sources/qBittorrentWebUi/Rest/queries.ts')
							:
								import('$/sources/qBittorrentWebUi/Rest/queries.remote.ts')
						)
						const binding = bindings[Source.qBittorrentWebUi_Rest][0]
						const timestampMs = Date.now()
						const [clientVersion, torrents, transfer] = await Promise.all([
							getApplicationVersion(binding),
							getTorrentsInfo(binding),
							getTransferInfo(binding),
						])
						const selectedTorrents = torrents.slice(0, resolverContextRowLimit(context))
						const verifiedPieceCounts = await Promise.all(selectedTorrents.map(async (torrent) => (
							(await getTorrentPieceStates(binding, torrent.hash))
								.filter((pieceState) => pieceState === 2).length
						)))
						const downloadedBytes = transfer.dl_info_data == null ? undefined : byteCount(transfer.dl_info_data, 'session downloaded bytes')
						const uploadedBytes = transfer.up_info_data == null ? undefined : byteCount(transfer.up_info_data, 'session uploaded bytes')

						return {
							clientId,
							clientName: 'qBittorrent',
							$$transfers: selectedTorrents.map((torrent, index) => transferReference(
								torrent,
								timestampMs,
								verifiedPieceCounts[index]
							)),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$clientState: clientSelector,
									timestampMs,
									source: Source.qBittorrentWebUi_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'clientVersion')]: clientVersion,
									[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'listenAddresses')]: [],
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
