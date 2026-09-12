import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { QueryClient } from '@tanstack/query-core'
import type { PersistenceAdapter } from '@tanstack/db-sqlite-persistence-core'

import { client } from '$/client/$client.svelte.ts'
import { subscribeEntity } from '$/client/$subscribe.svelte.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
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
const getBlobsByNamespace = vi.hoisted(() => vi.fn())
const getBlobProof = vi.hoisted(() => vi.fn())
const getShareRange = vi.hoisted(() => vi.fn())
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
	getBlobsByNamespace,
	getBlobProof,
	getShareRange,
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
	&& 'shareVersion' in resolver.projections
))
const blobOccurrencesResolver = celestiaNode.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaBlob
	&& '$$occurrences' in resolver.projections
))
const blobOccurrenceResolver = celestiaNode.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CelestiaBlobOccurrence
))

if (
	networkTimestampsResolver == null
	|| networkBlocksResolver == null
	|| timestampResolver == null
	|| blockResolver == null
	|| blobResolver == null
	|| blobOccurrencesResolver == null
	|| blobOccurrenceResolver == null
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
	getBlobsByNamespace.mockReset()
	getBlobProof.mockReset()
	getShareRange.mockReset()
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
		expect(networkBlocksResolver.projections.$$blocks.select(blocks)).toEqual([
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
		expect(networkBlocksResolver.projections.$$blocks.continuation(blocks)).toEqual({
			operation: 'network-blocks',
			terminal: false,
			token: '97',
		})
		expect(getHeaderByHeight).toHaveBeenCalledTimes(2)

		getHeaderLocalHead.mockResolvedValueOnce(header)
		const nextBlocks = await networkBlocksResolver.resolve.Network.resolve({
			$network: network,
		}, {
			...context,
			pagination: {
				limit: 2,
			},
			providerContinuationToken: '97',
		})
		expect(networkBlocksResolver.projections.$$blocks.select(nextBlocks).map((block) => (
			block[EntityMetaKey.Selector].height
		))).toEqual([
			97n,
			96n,
		])

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

	it('normalizes namespace-height indexes to distinct block-index occurrences', async () => {
		const namespaceId = `${'A'.repeat(39)}=`
		const commitment = `${'B'.repeat(43)}=`
		getBlobsByNamespace.mockResolvedValue([
			{
				namespace: namespaceId,
				data: 'AAAA',
				shareVersion: 0,
				commitment,
				index: 1,
				sizeBytes: 3n,
			},
			{
				namespace: namespaceId,
				data: 'AAAA',
				shareVersion: 0,
				commitment,
				index: 2,
				sizeBytes: 3n,
			},
		])
		const $namespace = {
			$network: celestiaNetwork,
			namespaceId,
		}
		const first = await blobOccurrenceResolver.resolve.NamespaceHeightIndex.resolve({
			$namespace,
			height: 100n,
			index: 1,
		}, context)
		const second = await blobOccurrenceResolver.resolve.NamespaceHeightIndex.resolve({
			$namespace,
			height: 100n,
			index: 2,
		}, context)
		if (!('NamespaceHeightCommitment' in blobOccurrencesResolver.resolve))
			throw new Error('CelestiaNode blob occurrences resolver missing NamespaceHeightCommitment')
		const occurrences = await blobOccurrencesResolver.resolve.NamespaceHeightCommitment.resolve({
			$namespace,
			height: 100n,
			commitment,
		}, context)

		expect(blobOccurrenceResolver.projections.$block(first)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: celestiaNetwork,
				height: 100n,
			},
		})
		expect(blobOccurrenceResolver.projections.index(first)).toBe(1)
		expect(blobOccurrenceResolver.projections.index(second)).toBe(2)
		expect(blobOccurrenceResolver.projections.$blob(first)).toEqual(
			blobOccurrenceResolver.projections.$blob(second)
		)
		expect(occurrences.map((occurrence) => (
			occurrence[EntityMetaKey.Selector]
		))).toEqual([
			{
				$block: {
					$network: celestiaNetwork,
					height: 100n,
				},
				index: 1,
			},
			{
				$block: {
					$network: celestiaNetwork,
					height: 100n,
				},
				index: 2,
			},
		])
		expect(occurrences.map((occurrence) => occurrence[EntityMetaKey.Selector])).toEqual([
			{
				$block: blobOccurrenceResolver.projections.$block(first)[EntityMetaKey.Selector],
				index: blobOccurrenceResolver.projections.index(first),
			},
			{
				$block: blobOccurrenceResolver.projections.$block(second)[EntityMetaKey.Selector],
				index: blobOccurrenceResolver.projections.index(second),
			},
		])
	})

	it('projects BlockIndex through share.GetRange namespace then blob.GetAll', async () => {
		const namespaceId = `${'A'.repeat(39)}=`
		const commitment = `${'B'.repeat(43)}=`
		if (!('BlockIndex' in blobOccurrenceResolver.resolve))
			throw new Error('CelestiaNode blob occurrence resolver missing BlockIndex')
		getShareRange.mockResolvedValue({
			namespace: namespaceId,
		})
		getBlobsByNamespace.mockResolvedValue([
			{
				namespace: namespaceId,
				data: 'AAAA',
				shareVersion: 0,
				commitment,
				index: 1,
				sizeBytes: 3n,
			},
		])
		const snapshot = await blobOccurrenceResolver.resolve.BlockIndex.resolve({
			$block: {
				$network: celestiaNetwork,
				height: 100n,
			},
			index: 1,
		}, context)
		expect(blobOccurrenceResolver.projections.$namespace(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: celestiaNetwork,
				namespaceId,
			},
		})
		expect(blobOccurrenceResolver.projections.$blob(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$namespace: {
					$network: celestiaNetwork,
					namespaceId,
				},
				height: 100n,
				commitment,
			},
		})
		expect(getShareRange).toHaveBeenCalledWith({
			publicEnv: context.publicEnv,
			height: 100n,
			from: 1,
			to: 2,
		})
		expect(getBlobsByNamespace).toHaveBeenCalledWith({
			publicEnv: context.publicEnv,
			height: 100n,
			namespaces: [namespaceId],
		})
		expect(getHeaderByHeight).not.toHaveBeenCalled()
	})

	it('rejects missing BlockIndex matches after share range', async () => {
		if (!('BlockIndex' in blobOccurrenceResolver.resolve))
			throw new Error('CelestiaNode blob occurrence resolver missing BlockIndex')
		getShareRange.mockResolvedValue({
			namespace: `${'A'.repeat(39)}=`,
		})
		getBlobsByNamespace.mockResolvedValue([])
		await expect(blobOccurrenceResolver.resolve.BlockIndex.resolve({
			$block: {
				$network: celestiaNetwork,
				height: 100n,
			},
			index: 1,
		}, context)).rejects.toThrow('expected one blob occurrence at index 1, received 0')
	})

	it('rejects missing and ambiguous namespace-height indexes', async () => {
		const namespaceId = `${'A'.repeat(39)}=`
		const occurrence = {
			$namespace: {
				$network: celestiaNetwork,
				namespaceId,
			},
			height: 100n,
			index: 2,
		}
		getBlobsByNamespace.mockResolvedValue([])
		await expect(blobOccurrenceResolver.resolve.NamespaceHeightIndex.resolve(
			occurrence,
			context
		)).rejects.toThrow('expected one blob occurrence at index 2, received 0')

		const duplicate = {
			namespace: namespaceId,
			data: 'AAAA',
			shareVersion: 0,
			commitment: `${'B'.repeat(43)}=`,
			index: 2,
			sizeBytes: 3n,
		}
		getBlobsByNamespace.mockResolvedValue([duplicate, duplicate])
		await expect(blobOccurrenceResolver.resolve.NamespaceHeightIndex.resolve(
			occurrence,
			context
		)).rejects.toThrow('expected one blob occurrence at index 2, received 2')
	})

	it('persists alias and canonical selectors as two convergent occurrences', async () => {
		const namespaceId = `${'A'.repeat(39)}=`
		const commitment = `${'B'.repeat(43)}=`
		let providerCalls = 0
		const $namespace = {
			$network: celestiaNetwork,
			namespaceId,
		}
		const aliases = [1, 2].map((index) => ({
			$namespace,
			height: 100n,
			index,
		}))
		const canonicals = [1, 2].map((index) => ({
			$block: {
				$network: celestiaNetwork,
				height: 100n,
			},
			index,
		}))
		const occurrenceSnapshot = ({
			$block,
			height,
			index,
		}: {
			$block: (typeof canonicals)[number]['$block']
			height: bigint
			index: number
		}) => ({
			$block: {
				[EntityMetaKey.Selector]: $block,
			},
			index,
			$namespace: {
				[EntityMetaKey.Selector]: $namespace,
			},
			height,
			$blob: {
				[EntityMetaKey.Selector]: {
					$namespace,
					height,
					commitment,
				},
			},
		})
		const identityCelestiaNode = {
			source: Source.CelestiaNode,
			resolvers: [{
				...blobOccurrenceResolver,
				resolve: {
					BlockIndex: {
						resolve: async ({
							$block,
							index,
						}) => occurrenceSnapshot({
							$block,
							height: $block.height,
							index,
						}),
					},
					NamespaceHeightIndex: {
						...blobOccurrenceResolver.resolve.NamespaceHeightIndex,
						resolve: async ({
							$namespace: _namespace,
							height,
							index,
						}) => {
							providerCalls += 1
							return occurrenceSnapshot({
								$block: {
									$network: _namespace.$network,
									height,
								},
								height,
								index,
							})
						},
					},
				},
			}],
		}
		const rowsByCollectionId = new Map<string, Map<string | number, object>>()
		const metadataByCollectionId = new Map<string, Map<string, string>>()
		const persistence = {
			adapter: {
				loadSubset: async (collectionId) => [
					...(rowsByCollectionId.get(collectionId) ?? new Map()),
				].map(([key, value]) => ({ key, value })),
				applyCommittedTx: async (collectionId, transaction) => {
					const rows = rowsByCollectionId.get(collectionId) ?? new Map()
					for (const mutation of transaction.mutations) {
						if (mutation.type === 'delete')
							rows.delete(mutation.key)
						else
							rows.set(mutation.key, mutation.value)
					}
					rowsByCollectionId.set(collectionId, rows)
					const metadata = metadataByCollectionId.get(collectionId) ?? new Map()
					for (const mutation of transaction.collectionMetadataMutations ?? []) {
						if (mutation.type === 'delete')
							metadata.delete(mutation.key)
						else
							metadata.set(mutation.key, JSON.stringify(mutation.value))
					}
					metadataByCollectionId.set(collectionId, metadata)
				},
				loadCollectionMetadata: async (collectionId) => [
					...(metadataByCollectionId.get(collectionId) ?? new Map()),
				].map(([key, value]) => ({
					key,
					value: JSON.parse(value),
				})),
				ensureIndex: async () => {},
			} satisfies PersistenceAdapter,
		}
		const createContext = () => client({
			schema,
			sourceProviders: [{
				provider: 'celestia-node-test',
				label: 'Celestia Node test',
				sources: {
					[Source.CelestiaNode]: {
						label: 'Celestia Node',
					},
				},
				bindings: {},
			}],
		})({
			resolvers: [identityCelestiaNode],
			sourceIndex: {
				enabledBindingIds: new Set<string>(),
				enabledSources: new Set([Source.CelestiaNode]),
				resolverPublicEnvBySource: new Map([[Source.CelestiaNode, {
					PUBLIC_CELESTIA_NODE_RPC_URL: 'https://example.com',
				}]]),
			},
		})({
			queryClient: new QueryClient(),
			persistence,
			schemaVersion: 1,
		})
		const firstContext = createContext()
		const aliasResources = aliases.map((alias) => subscribeEntity(
			firstContext,
			EntityType.CelestiaBlobOccurrence,
			alias,
			{
				fields: {
					$block: true,
					index: true,
				},
				sources: [Source.CelestiaNode],
			}
		))
		await Promise.all(aliasResources)
		for (const [index, canonical] of canonicals.entries())
			expect(subscribeEntity(
				firstContext,
				EntityType.CelestiaBlobOccurrence,
				canonical,
				{
					fields: {
						$block: true,
						index: true,
					},
					sources: [Source.CelestiaNode],
				}
			)).toBe(aliasResources[index])
		expect(providerCalls).toBe(2)
		const providerCallsBeforeRestart = providerCalls

		await expect.poll(() => (
			rowsByCollectionId.get('client.entities.CelestiaBlobOccurrence')?.size
		)).toBe(4)
		const restartedContext = createContext()
		for (const [index, alias] of aliases.entries()) {
			const aliasResource = subscribeEntity(
				restartedContext,
				EntityType.CelestiaBlobOccurrence,
				alias,
				{
					fields: {
						$block: true,
						index: true,
					},
					sources: [Source.CelestiaNode],
				}
			)
			await expect(aliasResource).resolves.toMatchObject({
				$block: {
					entitySelector: canonicals[index].$block,
				},
				index: index + 1,
			})
			await expect(subscribeEntity(
				restartedContext,
				EntityType.CelestiaBlobOccurrence,
				canonicals[index],
				{
					fields: {
						$block: true,
						index: true,
					},
					sources: [Source.CelestiaNode],
				}
			)).resolves.toMatchObject({
				$block: {
					entitySelector: canonicals[index].$block,
				},
				index: index + 1,
			})
		}
		expect(providerCalls).toBe(providerCallsBeforeRestart)
	})
})
