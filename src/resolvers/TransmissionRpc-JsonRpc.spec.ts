import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { createResolverContext } from '../../tests/resolverContext.ts'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


const {
	sessionGet,
	sessionStats,
	torrentGet,
} = vi.hoisted(() => ({
	sessionGet: vi.fn(),
	sessionStats: vi.fn(),
	torrentGet: vi.fn(),
}))

vi.mock('$/sources/Transmission/Rpc/queries.ts', () => ({
	sessionGet,
	sessionStats,
	torrentGet,
}))

const { default: resolverModule } = await import('$/resolvers/TransmissionRpc-JsonRpc.ts')
const fileResolver = resolverModule.resolvers.find(({ entityType }) => entityType === EntityType.BitTorrentFile)
const torrentResolver = resolverModule.resolvers.find(({ entityType }) => entityType === EntityType.BitTorrentMetainfo)
const clientResolver = resolverModule.resolvers.find(({ entityType }) => entityType === EntityType.BlockheadBitTorrentClientState)
if (fileResolver == null || torrentResolver == null || clientResolver == null)
	throw new Error('Transmission RPC resolvers missing')

const context = {
	...createResolverContext(),
	pagination: {
		limit: 8,
	},
}
const infoHash = '0123456789abcdef0123456789abcdef01234567'
const torrent = {
	hashString: infoHash.toUpperCase(),
	name: 'release',
	status: 4,
	downloadDir: '/downloads',
	downloadedEver: 1_024,
	uploadedEver: 64,
	rateDownload: 512,
	rateUpload: 8,
	peersConnected: 3,
	queuePosition: 2,
	uploadRatio: 1.25,
	pieceCount: 2,
	pieceSize: 600,
	totalSize: 1_024,
	files: [{
		name: 'release/image.iso',
		length: 1_024,
	}],
	fileStats: [{
		wanted: true,
		priority: 1,
	}],
	peers: [{
		address: '192.0.2.10',
		port: 51_413,
		clientName: 'Transmission 4.0.6',
		progress: 0.75,
	}],
}

describe('Transmission native client journey', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		sessionGet.mockReset()
		sessionStats.mockReset()
		torrentGet.mockReset()
		torrentGet.mockResolvedValue({ torrents: [torrent] })
	})

	it('materializes client health and source-clocked native transfers', async () => {
		let sessionStatsRead = false
		vi.spyOn(Date, 'now').mockImplementation(() => {
			if (!sessionStatsRead)
				throw new Error('Transmission observation clock sampled before session stats')
			return 1_786_000_000_000
		})
		sessionGet.mockResolvedValue({
			version: '4.0.6',
			'peer-port': 51_413,
			'bind-address-ipv4': '0.0.0.0',
			'bind-address-ipv6': '::',
		})
		sessionStats.mockImplementation(async () => {
			await Promise.resolve()
			sessionStatsRead = true
			return {
				activeTorrentCount: 1,
				downloadSpeed: 512,
				uploadSpeed: 8,
				'cumulative-stats': {
					downloadedBytes: 4_096,
					uploadedBytes: 128,
				},
			}
		})

		const snapshot = await clientResolver.resolve.ClientId.resolve({
			clientId: 'transmission-local',
		}, context)

		expect(snapshot.clientName).toBe('Transmission')
		expect(snapshot.$$timestamps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$clientState: { clientId: 'transmission-local' },
				timestampMs: 1_786_000_000_000,
				source: Source.TransmissionRpc_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'clientVersion')]: '4.0.6',
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'listenAddresses')]: [
					'0.0.0.0',
					'::',
				],
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'port')]: 51_413,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentClientState_Timestamp, [], 'downloadedBytes')]: 4_096n,
			},
		})
		expect(snapshot.$$transfers[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$client: { clientId: 'transmission-local' },
				$torrent: {
					infoHash,
					hashVersion: 'v1',
				},
				timestampMs: 1_786_000_000_000,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'status')]: 'downloading',
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'selectedFileIndexes')]: [0],
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'filePriorities')]: [1],
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'queuePosition')]: 2,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'ratio')]: 1.25,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'connectedPeerCount')]: 3,
			},
		})
	})

	it('materializes metainfo, files, and the complete piece layout', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_786_000_000_000)
		const snapshot = await torrentResolver.resolve.InfoHashHashVersion.resolve({
			infoHash,
			hashVersion: 'v1',
		}, context)

		expect(snapshot).toMatchObject({
			infoHash,
			hashVersion: 'v1',
			name: 'release',
			pieceLength: 600n,
			totalLength: 1_024n,
		})
		expect(snapshot.$$files).toHaveLength(1)
		expect(snapshot.$$pieces).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: expect.objectContaining({ pieceIndex: 0 }),
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BitTorrentPiece, [], 'offset')]: 0n,
					[entityFieldAddressKey(EntityType.BitTorrentPiece, [], 'length')]: 600n,
				}),
			}),
			expect.objectContaining({
				[EntityMetaKey.Selector]: expect.objectContaining({ pieceIndex: 1 }),
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BitTorrentPiece, [], 'offset')]: 600n,
					[entityFieldAddressKey(EntityType.BitTorrentPiece, [], 'length')]: 424n,
				}),
			}),
		])
		expect(snapshot.$$peerTimestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$torrent: {
					infoHash,
					hashVersion: 'v1',
				},
				peerId: '192.0.2.10:51413',
				timestampMs: 1_786_000_000_000,
				source: Source.TransmissionRpc_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'address')]: '192.0.2.10',
				[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'port')]: 51_413,
				[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'client')]: 'Transmission 4.0.6',
				[entityFieldAddressKey(EntityType.BitTorrentPeer_Timestamp, [], 'completedPercent')]: 75,
			},
		}])
		expect(snapshot.$$swarmTimestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$torrent: {
					infoHash,
					hashVersion: 'v1',
				},
				timestampMs: 1_786_000_000_000,
				source: Source.TransmissionRpc_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BitTorrentSwarmObservation_Timestamp, [], 'peerCount')]: 3,
			},
		}])
		expect(snapshot.$$clientTransfers).toEqual([{
			[EntityMetaKey.Selector]: {
				$client: { clientId: 'transmission-local' },
				$torrent: {
					infoHash,
					hashVersion: 'v1',
				},
				timestampMs: 1_786_000_000_000,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'status')]: 'downloading',
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'selectedFileIndexes')]: [0],
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'queuePosition')]: 2,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'ratio')]: 1.25,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'connectedPeerCount')]: 3,
			}),
		}])
		expect(snapshot.$$clientTransfers[0][EntityMetaKey.Selector].timestampMs).toBe(
			snapshot.$$swarmTimestamps[0][EntityMetaKey.Selector].timestampMs
		)
		expect(snapshot.$$clientTransfers[0][EntityMetaKey.Selector].$torrent).toEqual(
			snapshot.$$swarmTimestamps[0][EntityMetaKey.Selector].$torrent
		)
		expect(torrentResolver.projections.$$files.select(snapshot)).toEqual(snapshot.$$files)
		expect(torrentResolver.projections.$$files.resolveCount(snapshot)).toBe(1)
		expect(torrentResolver.projections.$$pieces.select(snapshot)).toEqual(snapshot.$$pieces)
		expect(torrentResolver.projections.$$pieces.resolveCount(snapshot)).toBe(2)
		expect(torrentResolver.projections.$$swarmTimestamps.select(snapshot)).toEqual(snapshot.$$swarmTimestamps)
		expect(torrentResolver.projections.$$swarmTimestamps.resolveCount(snapshot)).toBe(1)
		expect(torrentResolver.projections.$$clientTransfers.select(snapshot)).toEqual(snapshot.$$clientTransfers)
		expect(torrentResolver.projections.$$clientTransfers.resolveCount(snapshot)).toBe(1)

		await expect(fileResolver.resolve.TorrentFileIndex.resolve({
			$torrent: {
				infoHash,
				hashVersion: 'v1',
			},
			fileIndex: 0,
		}, context)).resolves.toMatchObject({
			fileIndex: 0,
			path: 'release/image.iso',
			length: 1_024n,
		})
	})

	it('omits swarm observation when peersConnected is absent but still yields the transfer', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_786_000_000_000)
		torrentGet.mockResolvedValue({
			torrents: [{
				...torrent,
				peersConnected: undefined,
			}],
		})

		const snapshot = await torrentResolver.resolve.InfoHashHashVersion.resolve({
			infoHash,
			hashVersion: 'v1',
		}, context)

		expect(snapshot.$$swarmTimestamps).toEqual([])
		expect(torrentResolver.projections.$$swarmTimestamps.resolveCount(snapshot)).toBe(0)
		expect(snapshot.$$clientTransfers).toEqual([{
			[EntityMetaKey.Selector]: {
				$client: { clientId: 'transmission-local' },
				$torrent: {
					infoHash,
					hashVersion: 'v1',
				},
				timestampMs: 1_786_000_000_000,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'status')]: 'downloading',
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'selectedFileIndexes')]: [0],
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'queuePosition')]: 2,
				[entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'ratio')]: 1.25,
			}),
		}])
		expect(snapshot.$$clientTransfers[0][EntityMetaKey.Fields]).not.toHaveProperty(
			entityFieldAddressKey(EntityType.BlockheadBitTorrentTransfer_Timestamp, [], 'connectedPeerCount')
		)
	})

	it('rejects foreign clients, v2 identities, and unsafe provider paths', async () => {
		await expect(clientResolver.resolve.ClientId.resolve({
			clientId: 'remote-client',
		}, context)).rejects.toThrow('unknown local client')
		await expect(torrentResolver.resolve.InfoHashHashVersion.resolve({
			infoHash,
			hashVersion: 'v2',
		}, context)).rejects.toThrow('invalid torrent identity')

		torrentGet.mockResolvedValue({
			torrents: [{
				...torrent,
				files: [{
					name: '../secret',
					length: 1,
				}],
			}],
		})
		await expect(torrentResolver.resolve.InfoHashHashVersion.resolve({
			infoHash,
			hashVersion: 'v1',
		}, context)).rejects.toThrow('unsafe torrent file path')
	})
})
