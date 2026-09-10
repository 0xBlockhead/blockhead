import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
	type EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type CelestiaBlobId = EntitySelector<typeof schema, EntityType.CelestiaBlob>
type CelestiaBlobOccurrenceBlockIndex = EntitySelectorForSelectorName<
	typeof schema,
	EntityType.CelestiaBlobOccurrence,
	'BlockIndex'
>
type CelestiaBlobOccurrenceNamespaceHeightIndex = EntitySelectorForSelectorName<
	typeof schema,
	EntityType.CelestiaBlobOccurrence,
	'NamespaceHeightIndex'
>

const occurrenceFromBlob = ({
	$namespace,
	height,
	blob,
}: {
	$namespace: EntitySelectorForSelectorName<
		typeof schema,
		EntityType.CelestiaNamespace,
		'NetworkNamespaceId'
	>
	height: bigint
	blob: {
		commitment: string
		index: number
	}
}) => ({
	[EntityMetaKey.Selector]: {
		$block: {
			$network: $namespace.$network,
			height,
		},
		index: blob.index,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.CelestiaBlobOccurrence, [], '$namespace')]: {
			[EntityMetaKey.Selector]: $namespace,
		},
		[entityFieldAddressKey(EntityType.CelestiaBlobOccurrence, [], 'height')]: height,
		[entityFieldAddressKey(EntityType.CelestiaBlobOccurrence, [], '$blob')]: {
			[EntityMetaKey.Selector]: {
				$namespace,
				height,
				commitment: blob.commitment,
			},
		},
	},
})

const occurrenceSnapshot = ({
	$namespace,
	height,
	index,
	commitment,
}: {
	$namespace: EntitySelectorForSelectorName<
		typeof schema,
		EntityType.CelestiaNamespace,
		'NetworkNamespaceId'
	>
	height: bigint
	index: number
	commitment: string
}) => ({
	$block: {
		[EntityMetaKey.Selector]: {
			$network: $namespace.$network,
			height,
		},
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
						const timestampMs = Date.parse(tip.time)
						if (!Number.isFinite(timestampMs))
							throw new Error('CelestiaNode: invalid head block time')

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

						const syncing = syncState.height < tip.height || !ready
						const health = (
							syncState.error !== '' ?
								syncState.error
							: sharesAvailable && ready ?
								'ok'
							:
								'degraded'
						)
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: {
										$network,
									},
									timestampMs,
									source: Source.CelestiaNode,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestHeight')]: tip.height,
									[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestHash')]: tip.hash,
									[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'latestBlockTimeMs')]: timestampMs,
									[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'syncing')]: syncing,
									[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'health')]: health,
									[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'sampledHeaderHeight')]: samplingStats.sampledHeaderHeight,
									...(nodeType != null && {
										[entityFieldAddressKey(EntityType.CelestiaNetwork_Timestamp, [], 'nodeType')]: nodeType,
									}),
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
							return {
								headers: [],
							}

						const {
							getHeaderByHeight,
							getHeaderLocalHead,
						} = await import('$/sources/Celestia/JsonRpc/queries.ts')
						const publicEnv = context.publicEnv
						const localHead = await getHeaderLocalHead(publicEnv)
						if (
							context.providerContinuationToken != null
							&& !/^[1-9][0-9]*$/.test(context.providerContinuationToken)
						)
							throw new Error(`${Source.CelestiaNode}: invalid blocks continuation`)

						const cursorHeight = context.providerContinuationToken == null ?
							localHead.height
						:
							BigInt(context.providerContinuationToken)
						if (cursorHeight > localHead.height)
							throw new Error(`${Source.CelestiaNode}: blocks continuation exceeds local head`)

						const heights = Array.from({
							length: Math.min(Number(cursorHeight), limit),
						}, (_value, blockOffset) => (
							cursorHeight - BigInt(blockOffset)
						))
						const headers = await Promise.all(
							heights.map((height) => (
								height === localHead.height ?
									localHead
								:
									getHeaderByHeight(publicEnv, height)
							))
						)
						return {
							headers: headers.map((header) => {
								const fields = headerFields(header)
								return {
									[EntityMetaKey.Selector]: {
										$network: {
											$network,
										},
										height: header.height,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'hash')]: fields.hash,
										...(fields.appHash != null && {
											[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'appHash')]: fields.appHash,
										}),
										...(fields.dataHash != null && {
											[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'dataHash')]: fields.dataHash,
										}),
										[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'proposerAddress')]: fields.proposerAddress,
										[entityFieldAddressKey(EntityType.CelestiaBlock, [], 'timestampMs')]: fields.timestampMs,
									},
								}
							}),
						}
					},
				},
			},
		})({
			$$blocks: {
				select: (snapshot) => snapshot.headers,
				continuation: (snapshot) => {
					const lastHeight = snapshot.headers.at(-1)?.[EntityMetaKey.Selector].height
					return {
						operation: 'network-blocks',
						terminal: lastHeight == null || lastHeight === 1n,
						...(lastHeight != null && lastHeight > 1n && {
							token: String(lastHeight - 1n),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.CelestiaNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertCelestiaMainnet($network)
						const {
							getHeaderLocalHead,
						} = await import('$/sources/Celestia/JsonRpc/queries.ts')
						return Number((await getHeaderLocalHead(context.publicEnv)).height)
					},
				},
			},
		})({
			$$blocks: {
				resolveCount: (count) => count,
			},
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
			sizeBytes: (blob) => blob.sizeBytes,
			blobData: (blob) => blob.blobData,
			payloadRequested: (blob) => blob.payloadRequested,
			proof: (blob) => blob.proof,
			shareProofAvailable: (blob) => blob.shareProofAvailable,
			$block: (blob) => blob.$block,
		}),

		defineResolver({
			entityType: EntityType.CelestiaBlob,
			resolve: {
				NamespaceHeightCommitment: {
					resolve: async ({ $namespace, height, commitment }, context) => {
						assertCelestiaMainnet($namespace.$network.$network)
						const {
							getBlobsByNamespace,
						} = await import('$/sources/Celestia/JsonRpc/queries.ts')
						return (await getBlobsByNamespace({
							publicEnv: context.publicEnv,
							height,
							namespaces: [$namespace.namespaceId],
						})).filter((blob) => (
							blob.commitment === commitment
						)).map((blob) => occurrenceFromBlob({
							$namespace,
							height,
							blob,
						}))
					},
				},
			},
		})({
			$$occurrences: (occurrences) => occurrences,
		}),

		defineResolver({
			entityType: EntityType.CelestiaBlobOccurrence,
			resolve: {
				BlockIndex: {
					resolve: async ({
						$block,
						index,
					}: CelestiaBlobOccurrenceBlockIndex, context): Promise<ReturnType<typeof occurrenceSnapshot>> => {
						assertCelestiaMainnet($block.$network.$network)
						if (!('height' in $block))
							throw new Error('CelestiaNode: blob occurrence BlockIndex requires a block height')
						const {
							getBlobsByNamespace,
							getShareRange,
						} = await import('$/sources/Celestia/JsonRpc/queries.ts')
						const height = $block.height
						const { namespace } = await getShareRange({
							publicEnv: context.publicEnv,
							height,
							from: index,
							to: index + 1,
						})
						const matches = (await getBlobsByNamespace({
							publicEnv: context.publicEnv,
							height,
							namespaces: [namespace],
						})).filter((blob) => blob.index === index)
						if (matches.length !== 1)
							throw new Error(`CelestiaNode: expected one blob occurrence at index ${index}, received ${matches.length}`)
						const [blob] = matches
						return occurrenceSnapshot({
							$namespace: {
								$network: $block.$network,
								namespaceId: namespace,
							},
							height,
							index,
							commitment: blob.commitment,
						})
					},
				},
				NamespaceHeightIndex: {
					resolve: async ({
						$namespace,
						height,
						index,
					}: CelestiaBlobOccurrenceNamespaceHeightIndex, context) => {
						assertCelestiaMainnet($namespace.$network.$network)
						const {
							getBlobsByNamespace,
						} = await import('$/sources/Celestia/JsonRpc/queries.ts')
						const matches = (await getBlobsByNamespace({
							publicEnv: context.publicEnv,
							height,
							namespaces: [$namespace.namespaceId],
						})).filter((blob) => blob.index === index)
						if (matches.length !== 1)
							throw new Error(`CelestiaNode: expected one blob occurrence at index ${index}, received ${matches.length}`)
						const [blob] = matches
						return occurrenceSnapshot({
							$namespace,
							height,
							index,
							commitment: blob.commitment,
						})
					},
				},
			},
		})({
			$block: (occurrence) => occurrence.$block,
			index: (occurrence) => occurrence.index,
			$namespace: (occurrence) => occurrence.$namespace,
			height: (occurrence) => occurrence.height,
			$blob: (occurrence) => occurrence.$blob,
		}),
	],
} satisfies RegisteredSourceResolverModule
