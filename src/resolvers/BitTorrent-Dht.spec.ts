import { createResolverContext } from '../../tests/resolverContext.ts'
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

const getPeers = vi.hoisted(() => vi.fn())

vi.mock('$/sources/BitTorrent/Dht/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/BitTorrent/Dht/queries.ts')>(),
	getPeers,
}))

const { default: bitTorrentDht } = await import('$/resolvers/BitTorrent-Dht.ts')
const [metainfoResolver] = bitTorrentDht.resolvers

const context = createResolverContext()

const torrentSelector = {
	infoHash: 'a'.repeat(40),
	hashVersion: 'v1',
} as const

describe('BitTorrent-Dht', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
	})

	it('embeds one get_peers observation and closest nodes from the first answering bootstrap', async () => {
		const remoteNodeId = Uint8Array.from({ length: 20 }, () => 1)
		const closestNodeId = Uint8Array.from({ length: 20 }, () => 2)
		getPeers.mockResolvedValue({
			remoteNodeId,
			token: Uint8Array.from([1, 2]),
			peers: [
				{
					host: '1.2.3.4',
					port: 6881,
				},
			],
			nodes: [
				{
					nodeId: closestNodeId,
					host: '5.6.7.8',
					port: 6882,
				},
			],
		})

		const snapshot = await metainfoResolver.resolve.InfoHashHashVersion.resolve(torrentSelector, context)
		const lookups = await metainfoResolver.projections.$$dhtLookups.resolve?.(torrentSelector, context)

		expect(snapshot).toEqual({
			infoHash: torrentSelector.infoHash,
			hashVersion: 'v1',
		})
		expect(lookups).toEqual([{
			[EntityMetaKey.Selector]: {
				$torrent: torrentSelector,
				timestampMs: 1_700_000_000_000,
				source: Source.BitTorrent,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'queriedNodeCount')]: 1,
				[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'responsiveNodeCount')]: 1,
				[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'peerCount')]: 1,
				[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'status')]: 'answered',
				[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], '$$closestNodes')]: [
					{
						[EntityMetaKey.Selector]: {
							nodeId: '02'.repeat(20),
							timestampMs: 1_700_000_000_000,
							source: Source.BitTorrent,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.BitTorrentDhtNode_Timestamp, [], 'address')]: '5.6.7.8',
							[entityFieldAddressKey(EntityType.BitTorrentDhtNode_Timestamp, [], 'port')]: 6882,
						},
					},
					{
						[EntityMetaKey.Selector]: {
							nodeId: '01'.repeat(20),
							timestampMs: 1_700_000_000_000,
							source: Source.BitTorrent,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.BitTorrentDhtNode_Timestamp, [], 'address')]: 'router.bittorrent.com',
							[entityFieldAddressKey(EntityType.BitTorrentDhtNode_Timestamp, [], 'port')]: 6881,
							[entityFieldAddressKey(EntityType.BitTorrentDhtNode_Timestamp, [], 'reachable')]: true,
						},
					},
				],
			},
		}])
		expect(getPeers).toHaveBeenCalledTimes(1)
	})

	it('fails closed for v2 info hashes without querying DHT', async () => {
		await expect(metainfoResolver.projections.$$dhtLookups.resolve?.({
			infoHash: 'b'.repeat(64),
			hashVersion: 'v2',
		}, context)).rejects.toThrow('get_peers requires a v1 20-byte info hash')
		expect(getPeers).not.toHaveBeenCalled()
	})

	it('tries the next bootstrap remote after a get_peers failure', async () => {
		getPeers
			.mockRejectedValueOnce(new Error('BitTorrent_Dht: timed out'))
			.mockResolvedValueOnce({
				remoteNodeId: Uint8Array.from({ length: 20 }, () => 3),
				token: Uint8Array.from([3]),
				peers: [],
				nodes: [],
			})

		const lookups = await metainfoResolver.projections.$$dhtLookups.resolve?.(torrentSelector, context)

		expect(lookups?.[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'queriedNodeCount')]: 2,
			[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'responsiveNodeCount')]: 1,
			[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'peerCount')]: 0,
			[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], 'status')]: 'answered',
			[entityFieldAddressKey(EntityType.BitTorrentDhtLookup_Timestamp, [], '$$closestNodes')]: [{
				[EntityMetaKey.Selector]: {
					nodeId: '03'.repeat(20),
					timestampMs: 1_700_000_000_000,
					source: Source.BitTorrent,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BitTorrentDhtNode_Timestamp, [], 'address')]: 'router.utorrent.com',
					[entityFieldAddressKey(EntityType.BitTorrentDhtNode_Timestamp, [], 'port')]: 6881,
					[entityFieldAddressKey(EntityType.BitTorrentDhtNode_Timestamp, [], 'reachable')]: true,
				},
			}],
		})
		expect(getPeers).toHaveBeenCalledTimes(2)
	})
})
