import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type CelestiaBlobId = EntitySelector<typeof schema, EntityType.CelestiaBlob>

const assertCelestiaMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'celestia')
		throw new Error('CelestiaNode: unsupported network')
}

const headerFields = (header: {
	hash: string
	height: bigint
	appHash?: string
	dataHash?: string
	proposerAddress: string
	time: string
}) => {
	const timestampMs = Date.parse(header.time)
	if (!Number.isFinite(timestampMs))
		throw new Error('CelestiaNode: invalid header time')
	return {
		hash: header.hash,
		height: header.height,
		...(header.appHash != null && {
			appHash: header.appHash,
		}),
		...(header.dataHash != null && {
			dataHash: header.dataHash,
		}),
		proposerAddress: header.proposerAddress,
		timestampMs,
	}
}

export default {
	source: Source.CelestiaNode,

	resolvers: [
		defineResolver({
			entityType: EntityType.CelestiaNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertCelestiaMainnet($network)
						const {
							getHeaderLocalHead,
							getHeaderNetworkHead,
						} = await import('$/sources/Celestia/JsonRpc/queries.ts')
						const publicEnv = context.publicEnv
						const [
							localHead,
							networkHead,
						] = await Promise.all([
							getHeaderLocalHead(publicEnv),
							getHeaderNetworkHead(publicEnv),
						])
						const tip = (
							networkHead.height >= localHead.height ?
								networkHead
							:
								localHead
						)
						const timestampMs = Date.parse(tip.time)
						if (!Number.isFinite(timestampMs))
							throw new Error('CelestiaNode: invalid head block time')
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: {
										$network,
									},
									timestampMs,
									source: Source.CelestiaNode,
								},
							},
						]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.CelestiaNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertCelestiaMainnet($network)
						const limit = resolverContextRowLimit(context)
						if (limit === 0)
							return []

						const {
							getHeaderLocalHead,
						} = await import('$/sources/Celestia/JsonRpc/queries.ts')
						const localHead = await getHeaderLocalHead(context.publicEnv)
						return Array.from({
							length: Math.min(Number(localHead.height), limit),
						}, (_value, blockOffset) => ({
							[EntityMetaKey.Selector]: {
								$network: {
									$network,
								},
								height: localHead.height - BigInt(blockOffset),
							},
						}))
					},
				},
			},
		})({
			$$blocks: (blocks) => blocks,
		}),

		defineResolver({
			entityType: EntityType.CelestiaNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs,
						source,
					}, context) => {
						assertCelestiaMainnet($network.$network)
						if (source !== Source.CelestiaNode)
							throw new Error(`CelestiaNode: unsupported observation source ${source}`)

						const {
							assertSharesAvailable,
							getDasSamplingStats,
							getHeaderLocalHead,
							getHeaderNetworkHead,
							getHeaderSyncState,
							getNodeInfo,
							getNodeReady,
						} = await import('$/sources/Celestia/JsonRpc/queries.ts')
						const publicEnv = context.publicEnv
						const [
							localHead,
							networkHead,
							syncState,
							ready,
							samplingStats,
						] = await Promise.all([
							getHeaderLocalHead(publicEnv),
							getHeaderNetworkHead(publicEnv),
							getHeaderSyncState(publicEnv),
							getNodeReady(publicEnv),
							getDasSamplingStats(publicEnv),
						])
						const tip = (
							networkHead.height >= localHead.height ?
								networkHead
							:
								localHead
						)
						const latestBlockTimeMs = Date.parse(tip.time)
						if (!Number.isFinite(latestBlockTimeMs))
							throw new Error('CelestiaNode: invalid head block time')
						if (timestampMs !== latestBlockTimeMs)
							throw new Error('CelestiaNode: head response does not match the observation time')

						let nodeType: string | undefined
						try {
							nodeType = (await getNodeInfo(publicEnv)).nodeType
						} catch {
							nodeType = undefined
						}

						let sharesAvailable = false
						try {
							await assertSharesAvailable(publicEnv, tip.height)
							sharesAvailable = true
						} catch {
							sharesAvailable = false
						}

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							latestHeight: tip.height,
							latestHash: tip.hash,
							latestBlockTimeMs,
							syncing: syncState.height < tip.height || !ready,
							health: (
								syncState.error !== '' ?
									syncState.error
								: sharesAvailable && ready ?
									'ok'
								:
									'degraded'
							),
							sampledHeaderHeight: samplingStats.sampledHeaderHeight,
							...(nodeType != null && {
								nodeType,
							}),
						}
					},
				},
			},
		})({
			$network: (timestamp) => timestamp.$network,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			latestHeight: (timestamp) => timestamp.latestHeight,
			latestHash: (timestamp) => timestamp.latestHash,
			latestBlockTimeMs: (timestamp) => timestamp.latestBlockTimeMs,
			syncing: (timestamp) => timestamp.syncing,
			health: (timestamp) => timestamp.health,
			sampledHeaderHeight: (timestamp) => timestamp.sampledHeaderHeight,
			nodeType: (timestamp) => timestamp.nodeType,
		}),

		defineResolver({
			entityType: EntityType.CelestiaBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }, context) => {
						assertCelestiaMainnet($network.$network)
						const {
							getHeaderByHeight,
						} = await import('$/sources/Celestia/JsonRpc/queries.ts')
						return headerFields(await getHeaderByHeight(
							context.publicEnv,
							height
						))
					},
				},
				NetworkHash: {
					resolve: async ({ $network, hash }, context) => {
						assertCelestiaMainnet($network.$network)
						const {
							getHeaderByHash,
						} = await import('$/sources/Celestia/JsonRpc/queries.ts')
						const header = await getHeaderByHash(
							context.publicEnv,
							hash
						)
						if (header.hash !== hash.replace(/^0x/i, '').toLowerCase())
							throw new Error(`CelestiaNode: header hash mismatch ${header.hash} !== ${hash}`)
						return headerFields(header)
					},
				},
			},
		})({
			hash: (block) => block.hash,
			height: (block) => block.height,
			appHash: (block) => block.appHash,
			dataHash: (block) => block.dataHash,
			proposerAddress: (block) => block.proposerAddress,
			timestampMs: (block) => block.timestampMs,
		}),

		defineResolver({
			entityType: EntityType.CelestiaBlob,
			resolve: {
				NamespaceHeightCommitment: {
					resolve: async ({
						$namespace,
						height,
						commitment,
					}: CelestiaBlobId, context) => {
						assertCelestiaMainnet($namespace.$network.$network)
						const {
							getBlob,
							getBlobProof,
							isBlobIncluded,
							namespaceForNodeRpc,
						} = await import('$/sources/Celestia/JsonRpc/queries.ts')
						const publicEnv = context.publicEnv
						const rpcNamespace = namespaceForNodeRpc($namespace.namespaceId)
						const [
							blob,
							proof,
						] = await Promise.all([
							getBlob({
								publicEnv,
								height,
								namespace: rpcNamespace,
								commitment,
							}),
							getBlobProof({
								publicEnv,
								height,
								namespace: rpcNamespace,
								commitment,
							}),
						])
						const shareProofAvailable = await isBlobIncluded({
							publicEnv,
							height,
							namespace: rpcNamespace,
							commitment,
							proof,
						})
						return {
							shareVersion: blob.shareVersion,
							index: blob.index,
							sizeBytes: blob.sizeBytes,
							blobData: blob.data,
							payloadRequested: true,
							proof,
							shareProofAvailable,
							$block: {
								[EntityMetaKey.Selector]: {
									$network: $namespace.$network,
									height,
								},
							},
						}
					},
				},
			},
		})({
			shareVersion: (blob) => blob.shareVersion,
			index: (blob) => blob.index,
			sizeBytes: (blob) => blob.sizeBytes,
			blobData: (blob) => blob.blobData,
			payloadRequested: (blob) => blob.payloadRequested,
			proof: (blob) => blob.proof,
			shareProofAvailable: (blob) => blob.shareProofAvailable,
			$block: (blob) => blob.$block,
		}),
	],
} satisfies RegisteredSourceResolverModule
