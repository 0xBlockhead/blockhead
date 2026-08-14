import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getApplicationPreferences,
	getApplicationVersion,
	getTorrentFiles,
	getTorrentPeers,
	getTorrentPieceStates,
	getTorrentProperties,
	getTorrentTrackers,
	getTorrentsInfo,
	getTransferInfo,
} = vi.hoisted(() => ({
	getApplicationPreferences: vi.fn(),
	getApplicationVersion: vi.fn(),
	getTorrentFiles: vi.fn(),
	getTorrentPeers: vi.fn(),
	getTorrentPieceStates: vi.fn(),
	getTorrentProperties: vi.fn(),
	getTorrentTrackers: vi.fn(),
	getTorrentsInfo: vi.fn(),
	getTransferInfo: vi.fn(),
}))

vi.mock('$/sources/qBittorrentWebUi/Rest/queries.ts', () => ({
	getApplicationPreferences,
	getApplicationVersion,
	getTorrentFiles,
	getTorrentPeers,
	getTorrentPieceStates,
	getTorrentProperties,
	getTorrentTrackers,
	getTorrentsInfo,
	getTransferInfo,
}))

const { default: qBittorrentResolvers } = await import('$/resolvers/qBittorrentWebUi-Rest.ts')

const fileResolver = qBittorrentResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BitTorrentFile
))
const metainfoResolver = qBittorrentResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BitTorrentMetainfo
))
const clientResolver = qBittorrentResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadBitTorrentClientState
))

if (fileResolver == null || metainfoResolver == null || clientResolver == null)
	throw new Error('qBittorrentWebUi-Rest spec missing resolver')

const context = {
	filters: [],
	sorts: [],
	pagination: { limit: 8 },
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const infoHash = '0123456789abcdef0123456789abcdef01234567'

describe('qBittorrent WebUI native client state', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		getApplicationPreferences.mockReset()
		getApplicationPreferences.mockResolvedValue({})
		getApplicationVersion.mockReset()
		getTorrentFiles.mockReset()
		getTorrentPeers.mockReset()
		getTorrentPeers.mockResolvedValue({
			rid: 1,
			full_update: true,
			peers: {},
		})
		getTorrentPieceStates.mockReset()
		getTorrentProperties.mockReset()
		getTorrentTrackers.mockReset()
		getTorrentsInfo.mockReset()
		getTransferInfo.mockReset()
	})

	it('materializes local client health and source-clocked native transfers', async () => {
		let selectedTorrentStateRead = false
		vi.spyOn(Date, 'now').mockImplementation(() => {
			if (!selectedTorrentStateRead)
				throw new Error('qBittorrent observation clock sampled before selected torrent state')
			return 1_786_000_000_000
		})
		getApplicationPreferences.mockResolvedValue({
			listen_port: 51_413,
			current_interface_address: '192.0.2.44',
		})
		getApplicationVersion.mockResolvedValue('v5.1.2')
		getTorrentsInfo.mockResolvedValue([{
			hash: infoHash.toUpperCase(),
			name: 'release',
			state: 'downloading',
			priority: 3,
			ratio: 1.25,
			save_path: '/downloads',
			downloaded: 1_024,
			uploaded: 64,
			dlspeed: 512,
			upspeed: 8,
			num_seeds: 2,
			num_leechs: 3,
		}])
		getTransferInfo.mockResolvedValue({
			dl_info_speed: 512,
			up_info_speed: 8,
			dl_info_data: 4_096,
			up_info_data: 128,
		})
		getTorrentFiles.mockResolvedValue([
			{
				index: 0,
				name: 'release/image.iso',
				size: 1_024,
				priority: 1,
			},
			{
				index: 1,
				name: 'release/notes.txt',
				size: 64,
				priority: 0,
			},
		])
		getTorrentPieceStates.mockImplementation(async () => {
			await Promise.resolve()
			selectedTorrentStateRead = true
			return [2, 2, 1, 0]
		})
		getTorrentTrackers.mockResolvedValue([])

		const snapshot = await clientResolver.resolve.ClientId.resolve({
			clientId: 'qbittorrent-local',
		}, context)

		expect(snapshot.clientName).toBe('qBittorrent')
		expect(snapshot.$$timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$clientState: { clientId: 'qbittorrent-local' },
				timestampMs: 1_786_000_000_000,
				source: Source.qBittorrentWebUi_Rest,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'clientVersion')]: 'v5.1.2',
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'listenAddresses')]: ['192.0.2.44'],
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'port')]: 51_413,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'downloadedBytes')]: 4_096n,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'activeTorrentCount')]: 1,
			}),
		}])
		expect(snapshot.$$transfers).toEqual([{
			[EntityMetaKey.Selector]: {
				$client: { clientId: 'qbittorrent-local' },
				$torrent: {
					infoHash,
					hashVersion: 'v1',
				},
				timestampMs: 1_786_000_000_000,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'status')]: 'downloading',
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'filePriorities')]: [
					1,
					0,
				],
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'queuePosition')]: 3,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'ratio')]: 1.25,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'downloadedBytes')]: 1_024n,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'connectedPeerCount')]: 5,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'verifiedPieces')]: 2,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'selectedFileIndexes')]: [0],
			}),
		}])
	})

	it('materializes torrent metadata and native file hierarchy from the local client', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_786_000_000_000)
		getTorrentsInfo.mockResolvedValue([{
			hash: infoHash,
			name: 'release',
			state: 'downloading',
			priority: 2,
			ratio: 0.5,
			num_seeds: 4,
			num_leechs: 6,
		}])
		getTorrentProperties.mockResolvedValue({
			piece_size: 262_144,
			total_size: 1_048_576,
		})
		getTorrentFiles.mockResolvedValue([{
			index: 0,
			name: 'release/image.iso',
			size: 1_048_576,
			priority: 1,
		}])
		getTorrentPieceStates.mockResolvedValue([2, 1, 0, 2])
		getTorrentTrackers.mockResolvedValue([
			{
				url: 'https://tracker.example/announce',
				status: 2,
				num_peers: 10,
				num_seeds: 4,
				num_leeches: 6,
				num_downloaded: 20,
			},
			{
				url: '** [DHT] **',
				status: 2,
				num_peers: 3,
			},
		])
		getTorrentPeers.mockResolvedValue({
			rid: 2,
			full_update: true,
			peers: {
				'peer-source-key': {
					ip: '192.0.2.10',
					port: 51_413,
					client: 'qBittorrent 5.1.2',
					progress: 0.75,
				},
			},
		})

		const snapshot = await metainfoResolver.resolve.InfoHashHashVersion.resolve({
			infoHash,
			hashVersion: 'v1',
		}, context)

		expect(snapshot).toEqual({
			infoHash,
			hashVersion: 'v1',
			name: 'release',
			pieceLength: 262_144n,
			totalLength: 1_048_576n,
			$$files: [{
				[EntityMetaKey.Selector]: {
					$torrent: {
						infoHash,
						hashVersion: 'v1',
					},
					fileIndex: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BitTorrentFile, [], 'path')]: 'release/image.iso',
					[entityFieldAddressKey(EntityType.BitTorrentFile, [], 'pathSegments')]: [
						'release',
						'image.iso',
					],
					[entityFieldAddressKey(EntityType.BitTorrentFile, [], 'length')]: 1_048_576n,
				},
			}],
			$$pieces: [
				0,
				1,
				2,
				3,
			].map((pieceIndex) => ({
				[EntityMetaKey.Selector]: {
					$torrent: {
						infoHash,
						hashVersion: 'v1',
					},
					pieceIndex,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BitTorrentPiece, [], 'offset')]: BigInt(pieceIndex * 262_144),
					[entityFieldAddressKey(EntityType.BitTorrentPiece, [], 'length')]: 262_144n,
				},
			})),
			$$trackers: [{
				[EntityMetaKey.Selector]: {
					trackerUrl: 'https://tracker.example/announce',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BitTorrentTracker, [], 'trackerKind')]: 'https',
					[entityFieldAddressKey(EntityType.BitTorrentTracker, [], '$$scrapes')]: [{
						[EntityMetaKey.Selector]: {
							$tracker: { trackerUrl: 'https://tracker.example/announce' },
							infoHash,
							timestampMs: 1_786_000_000_000,
							source: Source.qBittorrentWebUi_Rest,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.BitTorrentTrackerScrape_Timestamp, [], 'complete')]: 4,
							[entityFieldAddressKey(EntityType.BitTorrentTrackerScrape_Timestamp, [], 'downloaded')]: 20,
							[entityFieldAddressKey(EntityType.BitTorrentTrackerScrape_Timestamp, [], 'incomplete')]: 6,
							[entityFieldAddressKey(EntityType.BitTorrentTrackerScrape_Timestamp, [], 'status')]: 'working',
						},
					}],
				},
			}],
			$$peerTimestamps: [{
				[EntityMetaKey.Selector]: {
					$torrent: {
						infoHash,
						hashVersion: 'v1',
					},
					peerId: 'peer-source-key',
					timestampMs: 1_786_000_000_000,
					source: Source.qBittorrentWebUi_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'address')]: '192.0.2.10',
					[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'port')]: 51_413,
					[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'client')]: 'qBittorrent 5.1.2',
					[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'completedPercent')]: 75,
				},
			}],
			$$swarmTimestamps: [{
				[EntityMetaKey.Selector]: {
					$torrent: {
						infoHash,
						hashVersion: 'v1',
					},
					timestampMs: 1_786_000_000_000,
					source: Source.qBittorrentWebUi_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BitTorrentSwarmObservation_Timestamp, [], 'peerCount')]: 10,
					[entityFieldAddressKey(EntityType.BitTorrentSwarmObservation_Timestamp, [], 'seedCount')]: 4,
				},
			}],
			$$clientTransfers: [{
				[EntityMetaKey.Selector]: {
					$client: { clientId: 'qbittorrent-local' },
					$torrent: {
						infoHash,
						hashVersion: 'v1',
					},
					timestampMs: 1_786_000_000_000,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'status')]: 'downloading',
					[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'selectedFileIndexes')]: [0],
					[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'filePriorities')]: [1],
					[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'queuePosition')]: 2,
					[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'ratio')]: 0.5,
					[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'connectedPeerCount')]: 10,
					[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'verifiedPieces')]: 2,
				}),
			}],
		})

		await expect(fileResolver.resolve.TorrentFileIndex.resolve({
			$torrent: {
				infoHash: infoHash.toUpperCase(),
				hashVersion: 'v1',
			},
			fileIndex: 0,
		}, context)).resolves.toEqual({
			$torrent: {
				infoHash,
				hashVersion: 'v1',
			},
			fileIndex: 0,
			path: 'release/image.iso',
			pathSegments: [
				'release',
				'image.iso',
			],
			length: 1_048_576n,
		})
	})

	it('rejects unknown clients, mismatched hash versions, and unsafe file paths', async () => {
		await expect(clientResolver.resolve.ClientId.resolve({
			clientId: 'remote-client',
		}, context)).rejects.toThrow('unknown local client')

		await expect(metainfoResolver.resolve.InfoHashHashVersion.resolve({
			infoHash,
			hashVersion: 'v2',
		}, context)).rejects.toThrow('invalid torrent identity')

		getTorrentsInfo.mockResolvedValue([{ hash: infoHash }])
		getTorrentProperties.mockResolvedValue({ total_size: 1 })
		getTorrentFiles.mockResolvedValue([{
			index: 0,
			name: '../secret',
			size: 1,
		}])
		await expect(metainfoResolver.resolve.InfoHashHashVersion.resolve({
			infoHash,
			hashVersion: 'v1',
		}, context)).rejects.toThrow('unsafe torrent file path')

		getTorrentProperties.mockResolvedValue({
			piece_size: 1,
			total_size: 1,
		})
		getTorrentFiles.mockResolvedValue([{
			index: 0,
			name: 'safe',
			size: 1,
		}])
		getTorrentPieceStates.mockResolvedValue([2, 0])
		getTorrentTrackers.mockResolvedValue([])
		await expect(metainfoResolver.resolve.InfoHashHashVersion.resolve({
			infoHash,
			hashVersion: 'v1',
		}, context)).rejects.toThrow('inconsistent torrent piece geometry')
	})
})
