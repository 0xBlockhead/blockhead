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

const getHeaderByHash = vi.hoisted(() => vi.fn())
const getHeaderByHeight = vi.hoisted(() => vi.fn())
const getHeaderLocalHead = vi.hoisted(() => vi.fn())
const getHeaderNetworkHead = vi.hoisted(() => vi.fn())
const getHeaderSyncState = vi.hoisted(() => vi.fn())
const getDasSamplingStats = vi.hoisted(() => vi.fn())
const getNodeReady = vi.hoisted(() => vi.fn())
const getNodeInfo = vi.hoisted(() => vi.fn())
const assertSharesAvailable = vi.hoisted(() => vi.fn())
const getBlob = vi.hoisted(() => vi.fn())
const getBlobProof = vi.hoisted(() => vi.fn())
const isBlobIncluded = vi.hoisted(() => vi.fn())
const namespaceForNodeRpc = vi.hoisted(() => vi.fn((namespaceId: string) => namespaceId))

vi.mock('$/sources/Celestia/JsonRpc/queries.ts', () => ({
	getHeaderByHash,
	getHeaderByHeight,
	getHeaderLocalHead,
	getHeaderNetworkHead,
	getHeaderSyncState,
	getDasSamplingStats,
	getNodeReady,
	getNodeInfo,
	assertSharesAvailable,
	getBlob,
	getBlobProof,
	isBlobIncluded,
	namespaceForNodeRpc,
}))

const { default: celestiaNode } = await import('$/resolvers/CelestiaNode-JsonRpc.ts')

const network = {
	slug: 'celestia',
}
const celestiaNetwork = {
	$network: network,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 3,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_CELESTIA_NODE_RPC_URL: 'https://example.com',
	},
}

const networkTimestampsResolver = celestiaNode.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork
	&& '$$timestamps' in resolver.projections
))
const networkBlocksResolver = celestiaNode.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork
	&& '$$blocks' in resolver.projections
))
const timestampResolver = celestiaNode.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaNetwork_Timestamp
))
const blockResolver = celestiaNode.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaBlock
))
const blobResolver = celestiaNode.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaBlob
))

if (
	networkTimestampsResolver == null
	|| networkBlocksResolver == null
	|| timestampResolver == null
	|| blockResolver == null
	|| blobResolver == null
)
	throw new Error('CelestiaNode-JsonRpc spec missing resolvers')

const header = {
	chainId: 'celestia',
	height: 100n,
	hash: 'a'.repeat(64),
	parentHash: 'b'.repeat(64),
	dataHash: 'c'.repeat(64),
	appHash: 'd'.repeat(64),
	proposerAddress: 'e'.repeat(40),
	time: '2026-08-06T12:00:00.000Z',
}

beforeEach(() => {
	getHeaderByHash.mockReset()
	getHeaderByHeight.mockReset()
	getHeaderLocalHead.mockReset()
	getHeaderNetworkHead.mockReset()
	getHeaderSyncState.mockReset()
	getDasSamplingStats.mockReset()
	getNodeReady.mockReset()
	getNodeInfo.mockReset()
	assertSharesAvailable.mockReset()
	getBlob.mockReset()
	getBlobProof.mockReset()
	isBlobIncluded.mockReset()
	namespaceForNodeRpc.mockClear()
})

describe('CelestiaNode JsonRpc resolver', () => {
	it('projects network tip timestamps and tip-walked blocks', async () => {
		getHeaderLocalHead.mockResolvedValue(header)
		getHeaderNetworkHead.mockResolvedValue({
			...header,
			height: 102n,
			hash: 'f'.repeat(64),
			time: '2026-08-06T12:00:02.000Z',
		})
		getHeaderSyncState.mockResolvedValue({
			id: 1,
			height: 102n,
			fromHeight: 1n,
			toHeight: 102n,
			start: '2026-08-06T00:00:00Z',
			end: '2026-08-06T12:00:02Z',
			error: '',
		})
		getNodeReady.mockResolvedValue(true)
		getDasSamplingStats.mockResolvedValue({
			sampledHeaderHeight: 100n,
			catchupHeight: 102n,
			networkHeadHeight: 102n,
			catchUpDone: true,
			isRunning: true,
		})
		getNodeInfo.mockResolvedValue({
			nodeType: 'light',
			apiVersion: 'v0.28.4',
		})
		assertSharesAvailable.mockResolvedValue(undefined)

		const timestamps = await networkTimestampsResolver.resolve.Network.resolve({
			$network: network,
		}, context)
		expect(networkTimestampsResolver.projections.$$timestamps(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: celestiaNetwork,
					timestampMs: Date.parse('2026-08-06T12:00:02.000Z'),
					source: Source.CelestiaNode,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestHeight')]: 102n,
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestHash')]: 'f'.repeat(64),
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestBlockTimeMs')]: Date.parse('2026-08-06T12:00:02.000Z'),
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'syncing')]: false,
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'health')]: 'ok',
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'sampledHeaderHeight')]: 100n,
					[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'nodeType')]: 'light',
				},
			},
		])

		getHeaderLocalHead.mockResolvedValue(header)
		getHeaderByHeight.mockImplementation(async (_publicEnv, height: bigint) => ({
			...header,
			height,
			hash: height === 99n ? '1'.repeat(64) : '2'.repeat(64),
			time: height === 99n ? '2026-08-06T11:59:59.000Z' : '2026-08-06T11:59:58.000Z',
		}))
		const blocks = await networkBlocksResolver.resolve.Network.resolve({
			$network: network,
		}, context)
		expect(networkBlocksResolver.projections.$$blocks(blocks)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: celestiaNetwork,
					height: 100n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'hash')]: header.hash,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'appHash')]: header.appHash,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'dataHash')]: header.dataHash,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'proposerAddress')]: header.proposerAddress,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'timestampMs')]: Date.parse(header.time),
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: celestiaNetwork,
					height: 99n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'hash')]: '1'.repeat(64),
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'appHash')]: header.appHash,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'dataHash')]: header.dataHash,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'proposerAddress')]: header.proposerAddress,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'timestampMs')]: Date.parse('2026-08-06T11:59:59.000Z'),
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: celestiaNetwork,
					height: 98n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'hash')]: '2'.repeat(64),
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'appHash')]: header.appHash,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'dataHash')]: header.dataHash,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'proposerAddress')]: header.proposerAddress,
					[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'timestampMs')]: Date.parse('2026-08-06T11:59:58.000Z'),
				},
			},
		])
		expect(getHeaderByHeight).toHaveBeenCalledTimes(2)

		const blocksCountResolver = celestiaNode.resolvers.find((resolver) => (
			resolver.entityType === EntityType.CelestiaNetwork
			&& typeof resolver.projections.$$blocks === 'object'
			&& resolver.projections.$$blocks != null
			&& 'resolveCount' in resolver.projections.$$blocks
		))
		if (blocksCountResolver == null || !('Network' in blocksCountResolver.resolve))
			throw new Error('CelestiaNode block count resolver missing')
		await expect(blocksCountResolver.resolve.Network.resolve({
			$network: network,
		}, context)).resolves.toBe(100)
		expect(
			typeof blocksCountResolver.projections.$$blocks === 'object'
			&& blocksCountResolver.projections.$$blocks != null
			&& 'resolveCount' in blocksCountResolver.projections.$$blocks
			&& blocksCountResolver.projections.$$blocks.resolveCount(100)
		).toBe(100)
	})

	it('projects enrolled network observation fields from head + DAS + readiness', async () => {
		getHeaderLocalHead.mockResolvedValue(header)
		getHeaderNetworkHead.mockResolvedValue(header)
		getHeaderSyncState.mockResolvedValue({
			id: 1,
			height: 100n,
			fromHeight: 1n,
			toHeight: 100n,
			start: '2026-08-06T00:00:00Z',
			end: '2026-08-06T12:00:00Z',
			error: '',
		})
		getNodeReady.mockResolvedValue(true)
		getDasSamplingStats.mockResolvedValue({
			sampledHeaderHeight: 90n,
			catchupHeight: 100n,
			networkHeadHeight: 100n,
			catchUpDone: true,
			isRunning: true,
		})
		getNodeInfo.mockResolvedValue({
			nodeType: 'light',
			apiVersion: 'v0.28.4',
		})
		assertSharesAvailable.mockResolvedValue(undefined)

		const snapshot = await timestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: celestiaNetwork,
			timestampMs: Date.parse(header.time),
			source: Source.CelestiaNode,
		}, context)

		expect(timestampResolver.projections.latestHeight(snapshot)).toBe(100n)
		expect(timestampResolver.projections.latestHash(snapshot)).toBe(header.hash)
		expect(timestampResolver.projections.syncing(snapshot)).toBe(false)
		expect(timestampResolver.projections.health(snapshot)).toBe('ok')
		expect(timestampResolver.projections.sampledHeaderHeight(snapshot)).toBe(90n)
		expect(timestampResolver.projections.nodeType(snapshot)).toBe('light')
	})

	it('projects block headers by height and hash', async () => {
		getHeaderByHeight.mockResolvedValue(header)
		const byHeight = await blockResolver.resolve.NetworkHeight.resolve({
			$network: celestiaNetwork,
			height: 100n,
		}, context)
		expect(blockResolver.projections.hash(byHeight)).toBe(header.hash)
		expect(blockResolver.projections.appHash(byHeight)).toBe(header.appHash)
		expect(blockResolver.projections.timestampMs(byHeight)).toBe(Date.parse(header.time))

		getHeaderByHash.mockResolvedValue(header)
		const byHash = await blockResolver.resolve.NetworkHash.resolve({
			$network: celestiaNetwork,
			hash: header.hash,
		}, context)
		expect(blockResolver.projections.height(byHash)).toBe(100n)
	})

	it('projects blob payload, proof, and inclusion for NamespaceHeightCommitment', async () => {
		const namespace = `${'A'.repeat(39)}=`
		const commitment = `${'B'.repeat(43)}=`
		const proof = [
			{
				end: 8,
				nodes: ['AAAA'],
				is_max_namespace_ignored: false,
			},
		]
		getBlob.mockResolvedValue({
			namespace,
			data: 'AAAA',
			shareVersion: 0,
			commitment,
			index: 2,
			sizeBytes: 3n,
		})
		getBlobProof.mockResolvedValue(proof)
		isBlobIncluded.mockResolvedValue(true)

		const snapshot = await blobResolver.resolve.NamespaceHeightCommitment.resolve({
			$namespace: {
				$network: celestiaNetwork,
				namespaceId: namespace,
			},
			height: 100n,
			commitment,
		}, context)

		expect(blobResolver.projections.shareVersion(snapshot)).toBe(0)
		expect(blobResolver.projections.sizeBytes(snapshot)).toBe(3n)
		expect(blobResolver.projections.blobData(snapshot)).toBe('AAAA')
		expect(blobResolver.projections.shareProofAvailable(snapshot)).toBe(true)
		expect(blobResolver.projections.$block(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: celestiaNetwork,
				height: 100n,
			},
		})
	})
})
