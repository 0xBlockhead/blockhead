import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	TzktBigMap,
	TzktBigMapKey,
	TzktBigMapUpdate,
	TzktOperation,
} from '$/sources/Tzkt/Rest/types.ts'
import { TezosNetworkSelector } from '$/schema/TezosNetwork.ts'
import { TezosContractSelector } from '$/schema/TezosContract.ts'
import { TezosOperationGroupSelector } from '$/schema/TezosOperationGroup.ts'
import { TezosOperationSelector } from '$/schema/TezosOperation.ts'
import { TezosBigMapSelector } from '$/schema/TezosBigMap.ts'
import { TezosBigMap_TimestampSelector } from '$/schema/TezosBigMap_Timestamp.ts'
import { TezosBigMapDiffSelector } from '$/schema/TezosBigMapDiff.ts'
import { TezosBigMapKeySelector } from '$/schema/TezosBigMapKey.ts'
import { TezosBigMapKey_TimestampSelector } from '$/schema/TezosBigMapKey_Timestamp.ts'
import { TezosBlockSelector } from '$/schema/TezosBlock.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const tezosSlug = 'tezos' as const

const tzktRestBaseUrl = async () => (
	(await import('$/sources/Tzkt/Rest/queries.ts')).tzktRestEndpoints[0].restBaseUrl
)

const assertTezosMainnet = (network: NetworkId) => {
	if (
		('slug' in network && network.slug === tezosSlug)
		|| (
			'caip2' in network
			&& network.caip2.namespace === 'tezos'
			&& network.caip2.reference === 'NetXdQprcVkpaWU'
		)
	)
		return

	throw new Error('Tzkt_Rest: unsupported network')
}

const timestampMsFromIso = (iso: string) => (
	Date.parse(iso)
)

const bigMapFieldsFromWire = (
	$contract: { $network: { $network: NetworkId }, address: string },
	bigMap: TzktBigMap,
	bigMapId = BigInt(bigMap.ptr)
) => ({
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.TezosBigMap, [], '$contract')]: {
			[EntityMetaKey.Selector]: $contract,
		},
	},
		bigMapId,
		path: bigMap.path,
		...(bigMap.keyType != null && {
			keyType: bigMap.keyType,
		}),
	...(bigMap.valueType != null && {
		valueType: bigMap.valueType,
	}),
})

const bigMapKeyFieldsFromWire = (
	$bigMap: { $contract: { $network: { $network: NetworkId }, address: string }, bigMapId: bigint },
	key: TzktBigMapKey
) => ({
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.TezosBigMapKey, [], '$bigMap')]: {
			[EntityMetaKey.Selector]: $bigMap,
		},
	},
	keyHash: key.hash,
})

const bigMapDiffFieldsFromWire = ({
	$contract,
	bigMapId,
	keyHash,
	update,
	operationSelector,
}: {
	$contract: { $network: { $network: NetworkId }, address: string }
	bigMapId: bigint
	keyHash: string
	update: TzktBigMapUpdate
	operationSelector: {
		$operationGroup: {
			$network: { $network: NetworkId }
			operationHash: string
		}
		contentIndex: number
	}
}) => ({
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.TezosBigMapDiff, [], '$operation')]: {
			[EntityMetaKey.Selector]: operationSelector,
		},
		[entityFieldAddressKey(EntityType.TezosBigMapDiff, [], '$bigMap')]: {
			[EntityMetaKey.Selector]: {
				$contract,
				bigMapId,
			},
		},
	},
	bigMapId,
	keyHash,
	action: update.action,
	...(update.content?.key != null && {
		key: update.content.key,
	}),
	...(update.content?.value != null && {
		value: update.content.value,
	}),
})

const operationKindFromWire = (operation: TzktOperation) => (
	operation.parameter?.entrypoint != null ?
		`${operation.type}:${operation.parameter.entrypoint}`
	:
		operation.type
)

const operationGroupReference = (
	tezosNetwork: { $network: NetworkId },
	operationHash: string
) => ({
	[EntityMetaKey.Selector]: {
		$network: tezosNetwork,
		operationHash,
	},
})

export default {
	source: Source.Tzkt_Rest,

	resolvers: [
		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosNetwork,
			resolve: {
				[TezosNetworkSelector.Network]: {
					resolve: async ({ $network }) => {
						assertTezosMainnet($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
						}
					},
				},
			},
		})({
				$network: (network) => network.$network,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBlock,
			resolve: {
				[TezosBlockSelector.NetworkLevel]: {
					resolve: async ({ $network, level }) => {
						assertTezosMainnet($network.$network)
						if (level < 0n || level > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error(`Tzkt_Rest: unsupported block level ${level.toString()}`)

						const { getBlock } = await import('$/sources/Tzkt/Rest/queries.ts')
						const block = await getBlock({
							restBaseUrl: await tzktRestBaseUrl(),
							level,
						})
						if (BigInt(block.level) !== level)
							throw new Error(`Tzkt_Rest: block response level ${block.level} does not match ${level.toString()}`)
						if (block.hash.trim() === '')
							throw new Error(`Tzkt_Rest: block ${level.toString()} has an empty hash`)

						const timestampMs = timestampMsFromIso(block.timestamp)
						if (!Number.isFinite(timestampMs))
							throw new Error(`Tzkt_Rest: block ${level.toString()} has an invalid timestamp`)

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							level,
							hash: block.hash,
							timestampMs,
						}
					},
				},
			},
		})({
			$network: (block) => block.$network,
			level: (block) => block.level,
			hash: (block) => block.hash,
			timestampMs: (block) => block.timestampMs,
		}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosNetwork,
			resolve: {
				[TezosNetworkSelector.Network]: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMaps } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMaps({
							restBaseUrl: await tzktRestBaseUrl(),
							limit: resolverContextRowLimit(context),
						})).map((bigMap) => ({
							[EntityMetaKey.Selector]: {
								$contract: {
									$network: { $network: $network },
									address: bigMap.contract.address,
								},
								bigMapId: BigInt(bigMap.ptr),
							},
						}))
					},
				},
			},
		})({
				$$bigMaps: (bigMaps) => bigMaps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosNetwork,
			resolve: {
				[TezosNetworkSelector.Network]: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapUpdates({
							restBaseUrl: await tzktRestBaseUrl(),
							limit: resolverContextRowLimit(context),
						})).flatMap((update) => (
							update.contract?.address == null ?
								[]
							:
								[
									{
										[EntityMetaKey.Selector]: {
											$bigMap: {
												$contract: {
													$network: { $network: $network },
													address: update.contract.address,
												},
												bigMapId: BigInt(update.bigmap),
											},
											level: BigInt(update.level),
											source: Source.Tzkt_Rest,
										},
									},
								]
						))
					},
				},
			},
		})({
				$$bigMapTimestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosNetwork,
			resolve: {
				[TezosNetworkSelector.Network]: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMaps, listBigMapKeys } = await import('$/sources/Tzkt/Rest/queries.ts')
						const restBaseUrl = await tzktRestBaseUrl()
						const bigMaps = await listBigMaps({
							restBaseUrl,
							limit: Math.min(resolverContextRowLimit(context), 5),
						})
						const keyRows = (
							await Promise.all(
								bigMaps.map(async (bigMap) => ({
									bigMap,
									keys: await listBigMapKeys({
										restBaseUrl,
										bigMapId: bigMap.ptr,
										limit: Math.max(1, Math.floor(resolverContextRowLimit(context) / Math.max(bigMaps.length, 1))),
									}),
								}))
							)
						).flatMap(({ bigMap, keys }) => (
							keys.flatMap((key) => (
								key.updates === 0 ?
									[]
								:
									[
										{
											[EntityMetaKey.Selector]: {
												$bigMapKey: {
													$bigMap: {
														$contract: {
															$network: { $network: $network },
															address: bigMap.contract.address,
														},
														bigMapId: BigInt(bigMap.ptr),
													},
													keyHash: key.hash,
												},
												level: BigInt(key.firstLevel),
												source: Source.Tzkt_Rest,
											},
										},
									]
							))
						))
						return keyRows
					},
				},
			},
		})({
				$$bigMapKeyTimestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosNetwork,
			resolve: {
				[TezosNetworkSelector.Network]: {
					resolve: async ({ $network }, context) => {
						assertTezosMainnet($network)
						const { listBigMaps, listBigMapKeys } = await import('$/sources/Tzkt/Rest/queries.ts')
						const restBaseUrl = await tzktRestBaseUrl()
						const bigMaps = await listBigMaps({
							restBaseUrl,
							limit: Math.min(resolverContextRowLimit(context), 5),
						})
						const keyRows = (
							await Promise.all(
								bigMaps.map(async (bigMap) => ({
									bigMap,
									keys: await listBigMapKeys({
										restBaseUrl,
										bigMapId: bigMap.ptr,
										limit: Math.max(1, Math.floor(resolverContextRowLimit(context) / Math.max(bigMaps.length, 1))),
									}),
								}))
							)
						).flatMap(({ bigMap, keys }) => (
							keys.map((key) => ({
								bigMap,
								key,
							}))
						))
						return keyRows.map(({ bigMap, key }) => ({
							[EntityMetaKey.Selector]: {
								$bigMap: {
									$contract: {
										$network: { $network: $network },
										address: bigMap.contract.address,
									},
									bigMapId: BigInt(bigMap.ptr),
								},
								keyHash: key.hash,
							},
						}))
					},
				},
			},
		})({
				$$bigMapKeys: (keys) => keys,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosContract,
			resolve: {
				[TezosContractSelector.NetworkAddress]: {
					resolve: async ({ $network, address }) => {
						assertTezosMainnet($network.$network)
						const { getContract } = await import('$/sources/Tzkt/Rest/queries.ts')
						await getContract({
							restBaseUrl: await tzktRestBaseUrl(),
							address,
						})
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							address,
						}
					},
				},
			},
		})({
				$network: (contract) => contract.$network,
				address: (contract) => contract.address,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosContract,
			resolve: {
				[TezosContractSelector.NetworkAddress]: {
					resolve: async ({ $network, address }, context) => {
						assertTezosMainnet($network.$network)
						const { listBigMaps } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMaps({
							restBaseUrl: await tzktRestBaseUrl(),
							contract: address,
							limit: resolverContextRowLimit(context),
						})).map((bigMap) => ({
							[EntityMetaKey.Selector]: {
								$contract: {
									$network: $network,
									address,
								},
								bigMapId: BigInt(bigMap.ptr),
							},
						}))
					},
				},
			},
		})({
				$$bigMaps: (bigMaps) => bigMaps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosOperationGroup,
			resolve: {
				[TezosOperationGroupSelector.NetworkOperationHash]: {
					resolve: async ({ $network, operationHash }) => {
						assertTezosMainnet($network.$network)
						const { listOperationsByHash } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
							restBaseUrl: await tzktRestBaseUrl(),
							operationHash,
						})
						if (operations.length === 0)
							throw new Error(`Tzkt_Rest: operation group ${operationHash} not found`)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							operationHash,
						}
					},
				},
			},
		})({
				$network: (operationGroup) => operationGroup.$network,
				operationHash: (operationGroup) => operationGroup.operationHash,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosOperationGroup,
			resolve: {
				[TezosOperationGroupSelector.NetworkOperationHash]: {
					resolve: async ({ $network, operationHash }) => {
						assertTezosMainnet($network.$network)
						const { listOperationsByHash } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
							restBaseUrl: await tzktRestBaseUrl(),
							operationHash,
						})
						return operations.map((operation, contentIndex) => ({
							[EntityMetaKey.Selector]: {
								$operationGroup: {
									$network,
									operationHash,
								},
								contentIndex,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.TezosOperation, [], 'operationKind')]: operationKindFromWire(operation),
							},
						}))
					},
				},
			},
		})({
				$$operations: (operations) => operations,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosOperation,
			resolve: {
				[TezosOperationSelector.OperationGroupContentIndex]: {
					resolve: async ({ $operationGroup, contentIndex }) => {
						assertTezosMainnet($operationGroup.$network.$network)
						const { listOperationsByHash } = await import('$/sources/Tzkt/Rest/queries.ts')
						const operations = await listOperationsByHash({
							restBaseUrl: await tzktRestBaseUrl(),
							operationHash: $operationGroup.operationHash,
						})
						const operation = operations.at(contentIndex)
						if (operation == null)
							throw new Error(`Tzkt_Rest: operation ${$operationGroup.operationHash}[${contentIndex}] not found`)
						return {
							$operationGroup: operationGroupReference(
								$operationGroup.$network,
								$operationGroup.operationHash
							),
							contentIndex,
							operationKind: operationKindFromWire(operation),
						}
					},
				},
			},
		})({
				$operationGroup: (operation) => operation.$operationGroup,
				contentIndex: (operation) => operation.contentIndex,
				operationKind: (operation) => operation.operationKind,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosOperation,
			resolve: {
				[TezosOperationSelector.OperationGroupContentIndex]: {
					resolve: async ({ $operationGroup, contentIndex }) => {
						assertTezosMainnet($operationGroup.$network.$network)
						const { listOperationsByHash, listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						const restBaseUrl = await tzktRestBaseUrl()
						const operations = await listOperationsByHash({
							restBaseUrl,
							operationHash: $operationGroup.operationHash,
						})
						const operation = operations.at(contentIndex)
						if (operation == null) return []
						const updates = await listBigMapUpdates({
							restBaseUrl,
							level: operation.level,
						})
						return updates.flatMap((update) => (
							update.content?.hash == null ?
								[]
							:
								[
									{
										[EntityMetaKey.Selector]: {
											$operation: {
												$operationGroup: $operationGroup,
												contentIndex,
											},
											bigMapId: BigInt(update.bigmap),
											keyHash: update.content.hash,
										},
									},
								]
						))
					},
				},
			},
		})({
				$$bigMapDiffs: (diffs) => diffs,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMap,
			resolve: {
				[TezosBigMapSelector.ContractBigMapId]: {
					resolve: async ({ $contract, bigMapId }) => {
						assertTezosMainnet($contract.$network.$network)
						const { getBigMap } = await import('$/sources/Tzkt/Rest/queries.ts')
						const bigMap = await getBigMap({
							restBaseUrl: await tzktRestBaseUrl(),
							bigMapId,
						})
						if (BigInt(bigMap.ptr) !== bigMapId)
							throw new Error(`Tzkt_Rest: big map ${bigMapId.toString()} not found`)
						return bigMapFieldsFromWire($contract, bigMap, bigMapId)
					},
				},
			},
		})({
				$contract: (bigMap) => bigMap[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.TezosBigMap, [], '$contract')],
				bigMapId: (bigMap) => bigMap.bigMapId,
				path: (bigMap) => bigMap.path,
				keyType: (bigMap) => bigMap.keyType,
				valueType: (bigMap) => bigMap.valueType,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMap,
			resolve: {
				[TezosBigMapSelector.ContractBigMapId]: {
					resolve: async ({ $contract, bigMapId }, context) => {
						assertTezosMainnet($contract.$network.$network)
						const { listBigMapKeys } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapKeys({
							restBaseUrl: await tzktRestBaseUrl(),
							bigMapId,
							limit: resolverContextRowLimit(context),
						})).map((key) => ({
							[EntityMetaKey.Selector]: {
								$bigMap: {
									$contract: $contract,
									bigMapId,
								},
								keyHash: key.hash,
							},
						}))
					},
				},
			},
		})({
				$$keys: (keys) => keys,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMap,
			resolve: {
				[TezosBigMapSelector.ContractBigMapId]: {
					resolve: async ({ $contract, bigMapId }, context) => {
						assertTezosMainnet($contract.$network.$network)
						const { listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapUpdates({
							restBaseUrl: await tzktRestBaseUrl(),
							bigMapId,
							limit: resolverContextRowLimit(context),
						})).map((update) => ({
							[EntityMetaKey.Selector]: {
								$bigMap: {
									$contract: $contract,
									bigMapId,
								},
								level: BigInt(update.level),
								source: Source.Tzkt_Rest,
							},
						}))
					},
				},
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMapKey,
			resolve: {
				[TezosBigMapKeySelector.BigMapKeyHash]: {
					resolve: async ({ $bigMap, keyHash }, context) => {
						assertTezosMainnet($bigMap.$contract.$network.$network)
						const { listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						return (await listBigMapUpdates({
							restBaseUrl: await tzktRestBaseUrl(),
							bigMapId: $bigMap.bigMapId,
							keyHash,
							limit: resolverContextRowLimit(context),
						})).map((update) => ({
							[EntityMetaKey.Selector]: {
								$bigMapKey: {
									$bigMap: $bigMap,
									keyHash,
								},
								level: BigInt(update.level),
								source: Source.Tzkt_Rest,
							},
						}))
					},
				},
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMap_Timestamp,
			resolve: {
				[TezosBigMap_TimestampSelector.BigMapLevelSource]: {
					resolve: async ({ $bigMap, level, source }) => {
						assertTezosMainnet($bigMap.$contract.$network.$network)
						if (source !== Source.Tzkt_Rest)
							throw new Error(`Tzkt_Rest: unsupported observation source ${source}`)
						const { getBigMap, getBlock } = await import('$/sources/Tzkt/Rest/queries.ts')
						const restBaseUrl = await tzktRestBaseUrl()
						const [
							bigMap,
							block,
						] = await Promise.all([
							getBigMap({
								restBaseUrl,
								bigMapId: $bigMap.bigMapId,
								level,
							}),
							getBlock({
								restBaseUrl,
								level,
							}),
						])
						return {
							$bigMap: {
								[EntityMetaKey.Selector]: $bigMap,
							},
							level,
							source,
							timestampMs: timestampMsFromIso(block.timestamp),
							active: (
								level >= BigInt(bigMap.firstLevel)
								&& level <= BigInt(bigMap.lastLevel)
							),
							keyCount: bigMap.activeKeys,
							updateCount: bigMap.updates,
						}
					},
				},
			},
		})({
				$bigMap: (timestamp) => timestamp.$bigMap,
				level: (timestamp) => timestamp.level,
				source: (timestamp) => timestamp.source,
				timestampMs: (timestamp) => timestamp.timestampMs,
				active: (timestamp) => timestamp.active,
				keyCount: (timestamp) => timestamp.keyCount,
				updateCount: (timestamp) => timestamp.updateCount,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMapDiff,
			resolve: {
				[TezosBigMapDiffSelector.OperationBigMapIdKeyHash]: {
					resolve: async ({
						$operation,
						bigMapId,
						keyHash,
					}) => {
						assertTezosMainnet($operation.$operationGroup.$network.$network)
						const { listOperationsByHash, listBigMapUpdates } = await import('$/sources/Tzkt/Rest/queries.ts')
						const restBaseUrl = await tzktRestBaseUrl()
						const operations = await listOperationsByHash({
							restBaseUrl,
							operationHash: $operation.$operationGroup.operationHash,
						})
						const operation = operations.at($operation.contentIndex)
						if (operation == null)
							throw new Error(`Tzkt_Rest: operation ${$operation.$operationGroup.operationHash}[${$operation.contentIndex}] not found`)
						const updates = await listBigMapUpdates({
							restBaseUrl,
							bigMapId,
							level: operation.level,
						})
						const update = updates.find((row) => row.content?.hash === keyHash)
						if (update == null)
							throw new Error(`Tzkt_Rest: big map diff ${bigMapId.toString()}/${keyHash} not found at level ${operation.level}`)
						return bigMapDiffFieldsFromWire({
							$contract: {
								$network: $operation.$operationGroup.$network,
								address: update.contract?.address ?? '',
							},
							bigMapId,
							keyHash,
							update,
							operationSelector: $operation,
						})
					},
				},
			},
		})({
				$operation: (diff) => diff.$operation,
				bigMapId: (diff) => diff.bigMapId,
				keyHash: (diff) => diff.keyHash,
				action: (diff) => diff.action,
				key: (diff) => diff.key,
				value: (diff) => diff.value,
				$bigMap: (diff) => diff.$bigMap,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMapKey,
			resolve: {
				[TezosBigMapKeySelector.BigMapKeyHash]: {
					resolve: async ({ $bigMap, keyHash }) => {
						assertTezosMainnet($bigMap.$contract.$network.$network)
						const { getBigMapKey } = await import('$/sources/Tzkt/Rest/queries.ts')
						const key = await getBigMapKey({
							restBaseUrl: await tzktRestBaseUrl(),
							bigMapId: $bigMap.bigMapId,
							keyHash,
						})
						return bigMapKeyFieldsFromWire($bigMap, key)
					},
				},
			},
		})({
				$bigMap: (key) => key.$bigMap,
				keyHash: (key) => key.keyHash,
			}),

		defineResolver(Source.Tzkt_Rest, {
			entityType: EntityType.TezosBigMapKey_Timestamp,
			resolve: {
				[TezosBigMapKey_TimestampSelector.BigMapKeyLevelSource]: {
					resolve: async ({
						$bigMapKey,
						level,
						source,
					}) => {
						assertTezosMainnet($bigMapKey.$bigMap.$contract.$network.$network)
						if (source !== Source.Tzkt_Rest)
							throw new Error(`Tzkt_Rest: unsupported observation source ${source}`)
						const { getBigMapKey, getBlock } = await import('$/sources/Tzkt/Rest/queries.ts')
						const restBaseUrl = await tzktRestBaseUrl()
						const [
							key,
							block,
						] = await Promise.all([
							getBigMapKey({
								restBaseUrl,
								bigMapId: $bigMapKey.$bigMap.bigMapId,
								keyHash: $bigMapKey.keyHash,
								level,
							}),
							getBlock({
								restBaseUrl,
								level,
							}),
						])
						return {
							$bigMapKey: {
								[EntityMetaKey.Selector]: {
									$bigMap: $bigMapKey.$bigMap,
									keyHash: $bigMapKey.keyHash,
								},
							},
							level,
							source,
							timestampMs: timestampMsFromIso(block.timestamp),
							key: key.key,
							value: key.value,
							firstLevel: BigInt(key.firstLevel),
							lastLevel: BigInt(key.lastLevel),
							updateCount: key.updates,
							active: key.active,
						}
					},
				},
			},
		})({
				$bigMapKey: (timestamp) => timestamp.$bigMapKey,
				level: (timestamp) => timestamp.level,
				source: (timestamp) => timestamp.source,
				timestampMs: (timestamp) => timestamp.timestampMs,
				key: (timestamp) => timestamp.key,
				value: (timestamp) => timestamp.value,
				firstLevel: (timestamp) => timestamp.firstLevel,
				lastLevel: (timestamp) => timestamp.lastLevel,
				updateCount: (timestamp) => timestamp.updateCount,
				active: (timestamp) => timestamp.active,
			}),
	],
}
