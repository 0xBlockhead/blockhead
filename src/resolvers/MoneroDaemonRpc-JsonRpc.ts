import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type {
	EntitySelector,
	EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	MoneroRpcInfo,
	MoneroRpcTransaction,
	MoneroRpcTransactionInput,
	MoneroRpcTransactionOutput,
} from '$/sources/MoneroDaemonRpc/JsonRpc/types.ts'
import { moneroMainnetRpcEndpoints } from '$/sources/MoneroDaemonRpc/JsonRpc/queries.ts'
type NetworkId = EntitySelector<typeof schema, EntityType.Network>

type MoneroBlockSelector = EntitySelectorForSelectorName<
	typeof schema,
	EntityType.MoneroBlock,
	'NetworkHeight' | 'NetworkHeightHash'
>

const moneroMainnetCaip2 = networkBySlug.monero.caip2

const assertMoneroMainnet = (network: NetworkId) => {
	if (
		'slug' in network ?
			network.slug !== networkBySlug.monero.slug
		:
			(
				network.caip2.namespace !== moneroMainnetCaip2.namespace
				|| network.caip2.reference !== moneroMainnetCaip2.reference
			)
	)
		throw new Error('MoneroDaemonRpc_JsonRpc: unsupported network')
}

const moneroTransactionOutputFields = (
	transaction: MoneroRpcTransaction,
	output: MoneroRpcTransactionOutput,
	outputIndex: number
) => ({
	...(output.target.key != null && {
		publicKey: output.target.key,
	}),
	...(output.target.key == null && output.target.tagged_key?.key != null && {
		publicKey: output.target.tagged_key.key,
	}),
	...(transaction.decoded_json?.rct_signatures?.outPk?.[outputIndex]?.mask != null && {
		commitment: transaction.decoded_json.rct_signatures.outPk[outputIndex].mask,
	}),
})

const moneroKeyImageFields = (
	transactionId: {
		$network: NetworkId
		txHash: string
	},
	input: MoneroRpcTransactionInput,
	inputIndex: number
) => ({
	...(input.key != null && {
		$ring: {
			[EntityMetaKey.Selector]: {
				$keyImage: {
					$transaction: transactionId,
					inputIndex,
					keyImage: input.key.k_image,
				},
			},
		},
	}),
})

const absoluteGlobalOutputIndices = (keyOffsets: readonly number[]) => (
	keyOffsets.reduce<bigint[]>((indices, offset) => (
		[
			...indices,
			(indices.at(-1) ?? 0n) + BigInt(offset),
		]
	), [])
)

const moneroRingMemberFields = (
	input: MoneroRpcTransactionInput,
	memberIndex: number
) => {
	const globalOutputIndex = (
		input.key == null ?
			undefined
		:
			absoluteGlobalOutputIndices(input.key.key_offsets)[memberIndex]
	)
	return (
		globalOutputIndex == null ?
			{}
		:
			{
				globalOutputIndex,
			}
	)
}

const moneroTransactionFields = (
	network: NetworkId,
	transaction: MoneroRpcTransaction
) => ({
	...(!transaction.in_pool && {
		$block: {
			[EntityMetaKey.Selector]: {
				$network: network,
				height: BigInt(transaction.block_height),
			},
		},
	}),
	...(transaction.decoded_json != null && {
		version: transaction.decoded_json.version,
		unlockTime: BigInt(transaction.decoded_json.unlock_time),
		...(transaction.decoded_json.rct_signatures?.txnFee != null && {
			feeAtomicUnits: BigInt(transaction.decoded_json.rct_signatures.txnFee),
		}),
		$$keyImages: transaction.decoded_json.vin.flatMap((input, inputIndex) => (
			input.key == null ?
				[]
			:
				[
					{
						[EntityMetaKey.Selector]: {
							$transaction: {
								$network: network,
								txHash: transaction.tx_hash,
							},
							inputIndex,
							keyImage: input.key.k_image,
						},
						...moneroKeyImageFields(
							{
								$network: network,
								txHash: transaction.tx_hash,
							},
							input,
							inputIndex
					),
					},
				]
		)),
		$$stealthOutputs: transaction.decoded_json.vout.map((output, outputIndex) => ({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txHash: transaction.tx_hash,
				},
				outputIndex,
			},
			...moneroTransactionOutputFields(
				transaction,
				output,
				outputIndex
			),
		})),
	}),
})

const getMoneroTransaction = async ({ $network, txHash }: {
	$network: NetworkId
	txHash: string
}) => {
	assertMoneroMainnet($network)
	const { getTransactions } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
	const transaction = (await getTransactions({
		txHashes: [txHash],
	})).txs.at(0)
	if (transaction == null)
		throw new Error(`MoneroDaemonRpc_JsonRpc: transaction not found for hash ${txHash}`)
	return transaction
}

const resolveMoneroBlock = async (entitySelector: MoneroBlockSelector) => {
	assertMoneroMainnet(entitySelector.$network)
	const { getBlock } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
	const block = await getBlock({
		height: entitySelector.height,
	})
	if (
		'hash' in entitySelector
		&& block.block_header.hash !== entitySelector.hash
	)
		throw new Error('MoneroDaemonRpc_JsonRpc: block hash does not match the requested selector')

	return {
		hash: block.block_header.hash,
		...(block.block_header.height > 0 && {
			$parent: {
				[EntityMetaKey.Selector]: {
					$network: entitySelector.$network,
					height: BigInt(block.block_header.height - 1),
					hash: block.block_header.prev_hash,
				},
			},
		}),
		timestampMs: block.block_header.timestamp * 1000,
		difficulty: BigInt(block.block_header.difficulty),
		weightBytes: block.block_header.block_weight,
		$$transactions: [
			block.miner_tx_hash,
			...(block.tx_hashes ?? []),
		].map((txHash) => ({
			[EntityMetaKey.Selector]: {
				$network: entitySelector.$network,
				txHash,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.MoneroTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network: entitySelector.$network,
						height: entitySelector.height,
						hash: block.block_header.hash,
					},
				},
			},
		})),
	}
}

const moneroNetworkTimestampFields = (info: MoneroRpcInfo) => ({
	height: BigInt(info.height),
	targetHeight: BigInt(info.target_height),
	topBlockHash: info.top_block_hash,
	difficulty: BigInt(info.difficulty),
	...(info.wide_difficulty != null && {
		wideDifficulty: BigInt(info.wide_difficulty),
	}),
	cumulativeDifficulty: BigInt(info.cumulative_difficulty),
	...(info.wide_cumulative_difficulty != null && {
		wideCumulativeDifficulty: BigInt(info.wide_cumulative_difficulty),
	}),
	...(info.block_size_limit != null && {
		blockSizeLimit: info.block_size_limit,
	}),
	...(info.block_size_median != null && {
		blockSizeMedian: info.block_size_median,
	}),
	...(info.block_weight_limit != null && {
		blockWeightLimit: info.block_weight_limit,
	}),
	...(info.block_weight_median != null && {
		blockWeightMedian: info.block_weight_median,
	}),
	...(info.database_size != null && {
		databaseSize: info.database_size,
	}),
	...(info.free_space != null && {
		freeSpace: info.free_space,
	}),
	greyPeerlistSize: info.grey_peerlist_size,
	whitePeerlistSize: info.white_peerlist_size,
	incomingConnections: info.incoming_connections_count,
	outgoingConnections: info.outgoing_connections_count,
	txCount: BigInt(info.tx_count),
	txPoolSize: info.tx_pool_size,
	altBlocksCount: info.alt_blocks_count,
	targetSeconds: info.target,
	...(info.rpc_connections_count != null && {
		rpcConnections: info.rpc_connections_count,
	}),
	mainnet: info.mainnet,
	nettype: info.nettype,
	offline: info.offline,
	synchronized: info.synchronized,
	wasBootstrapEverUsed: info.was_bootstrap_ever_used,
	version: info.version,
	status: info.status,
})

export default {
	source: Source.MoneroDaemonRpc_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.MoneroNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertMoneroMainnet($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							rpcEndpoints: [...moneroMainnetRpcEndpoints],
						}
					},
				}
			},
		})({
				$network: (network) => network.$network,
				rpcEndpoints: (network) => network.rpcEndpoints,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertMoneroMainnet(network)
						return {
							moneroRpcEndpoints: [...moneroMainnetRpcEndpoints],
						}
					},
				}
			},
			resolveLive: {
				operatorState: {
					facetPath: [
						'Monero',
					],
					publishes: {
						'$$timestamps': true,
						'$$blocks': true,
					},
					start: ({
						fields,
						parentEntitySelector,
						signal,
					}) => {
						assertMoneroMainnet(parentEntitySelector)
						let timeout: ReturnType<typeof setTimeout> | undefined
						const poll = async () => {
							const { getInfo } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
							const info = await getInfo()
							if (signal.aborted)
								return
							if (info.height < 1)
								throw new Error('MoneroDaemonRpc_JsonRpc: daemon height has no head block')

							fields.$$timestamps.replaceRows([{
								source: Source.MoneroDaemonRpc_JsonRpc,
								value: [{
									[EntityMetaKey.Selector]: {
										$network: parentEntitySelector,
										timestampMs: Date.now(),
										source: Source.MoneroDaemonRpc_JsonRpc,
									},
									[EntityMetaKey.Fields]: Object.fromEntries(
										Object.entries(moneroNetworkTimestampFields(info)).map(([fieldName, value]) => [
											entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], fieldName),
											value,
										])
									),
								}],
							}])
							fields.$$blocks.replaceRows([{
								source: Source.MoneroDaemonRpc_JsonRpc,
								value: [{
									[EntityMetaKey.Selector]: {
										$network: parentEntitySelector,
										height: BigInt(info.height - 1),
										hash: info.top_block_hash,
									},
								}],
							}])
							timeout = setTimeout(() => { void poll() }, 10_000)
						}
						const abort = () => {
							if (timeout != null)
								clearTimeout(timeout)
						}
						signal.addEventListener('abort', abort, { once: true })
						void poll()
						return () => {
							signal.removeEventListener('abort', abort)
							abort()
						}
					},
				},
			},
		})({
				Monero: {
					rpcEndpoints: (network) => network.moneroRpcEndpoints,
					'$$timestamps': {},
					'$$blocks': {},
				},
			}),

		defineResolver({
			entityType: EntityType.MoneroBlock,
			resolve: {
				NetworkHeight: {
					resolve: resolveMoneroBlock,
				},
				NetworkHeightHash: {
					resolve: resolveMoneroBlock,
				},
			},
		})({
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				timestampMs: (block) => block.timestampMs,
				difficulty: (block) => block.difficulty,
				weightBytes: (block) => block.weightBytes,
				$$transactions: {
					select: (block) => block.$$transactions,
					resolveCount: (block) => block.$$transactions.length,
				},
			}),

		defineResolver({
			entityType: EntityType.MoneroTransaction,
			resolve: {
				NetworkTxHash: {
					resolve: async (entitySelector) => (
						moneroTransactionFields(
							entitySelector.$network,
							await getMoneroTransaction(entitySelector)
						)
					),
				}
			},
		})({
				$block: (transaction) => transaction.$block,
				version: (transaction) => transaction.version,
				unlockTime: (transaction) => transaction.unlockTime,
				feeAtomicUnits: (transaction) => transaction.feeAtomicUnits,
				$$keyImages: {
					select: (transaction) => transaction.$$keyImages ?? [],
					resolveCount: (transaction) => (transaction.$$keyImages ?? []).length,
				},
				$$stealthOutputs: {
					select: (transaction) => transaction.$$stealthOutputs ?? [],
					resolveCount: (transaction) => (transaction.$$stealthOutputs ?? []).length,
				},
			}),

		defineResolver({
			entityType: EntityType.MoneroKeyImage,
			resolve: {
				MoneroTransactionInputIndexKeyImage: {
					resolve: async ({ $transaction, inputIndex, keyImage }) => {
						const transaction = await getMoneroTransaction($transaction)
						const input = transaction.decoded_json?.vin[inputIndex]
						if (input?.key == null || input.key.k_image !== keyImage)
							throw new Error(`MoneroDaemonRpc_JsonRpc: key image ${keyImage} not found for ${$transaction.txHash}`)
						return moneroKeyImageFields(
							$transaction,
							input,
							inputIndex
						)
					},
				}
			},
		})({
				$ring: (keyImage) => keyImage.$ring,
			}),

		defineResolver({
			entityType: EntityType.MoneroRing,
			resolve: {
				MoneroKeyImage: {
					resolve: async ({ $keyImage }) => {
						const transaction = await getMoneroTransaction($keyImage.$transaction)
						const input = transaction.decoded_json?.vin[$keyImage.inputIndex]
						if (input?.key == null || input.key.k_image !== $keyImage.keyImage)
							throw new Error(`MoneroDaemonRpc_JsonRpc: ring not found for key image ${$keyImage.keyImage}`)
						return {
							$$members: input.key.key_offsets.map((_keyOffset, memberIndex) => ({
								[EntityMetaKey.Selector]: {
									$ring: {
										$keyImage,
									},
									memberIndex,
								},
								...moneroRingMemberFields(
									input,
									memberIndex
								),
							})),
						}
					},
				}
			},
		})({
				$$members: {
					select: (ring) => ring.$$members,
					resolveCount: (ring) => ring.$$members.length,
				},
			}),

		defineResolver({
			entityType: EntityType.MoneroRingMember,
			resolve: {
				MoneroRingMemberIndex: {
					resolve: async ({ $ring, memberIndex }) => {
						const transaction = await getMoneroTransaction($ring.$keyImage.$transaction)
						const input = transaction.decoded_json?.vin[$ring.$keyImage.inputIndex]
						if (input?.key == null || input.key.k_image !== $ring.$keyImage.keyImage)
							throw new Error(`MoneroDaemonRpc_JsonRpc: ring member ${memberIndex.toString()} not found for key image ${$ring.$keyImage.keyImage}`)
						return moneroRingMemberFields(
							input,
							memberIndex
						)
					},
				}
			},
		})({
				globalOutputIndex: (ringMember) => ringMember.globalOutputIndex,
			}),

		defineResolver({
			entityType: EntityType.MoneroStealthOutput,
			resolve: {
				MoneroTransactionOutputIndex: {
					resolve: async ({ $transaction, outputIndex }) => {
						const transaction = await getMoneroTransaction($transaction)
						const output = transaction.decoded_json?.vout[outputIndex]
						if (output == null)
							throw new Error(`MoneroDaemonRpc_JsonRpc: stealth output ${outputIndex.toString()} not found for ${$transaction.txHash}`)
						return moneroTransactionOutputFields(
							transaction,
							output,
							outputIndex
						)
					},
				}
			},
		})({
				publicKey: (output) => output.publicKey,
				commitment: (output) => output.commitment,
			}),

		defineResolver({
			entityType: EntityType.MoneroNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertMoneroMainnet($network)
						const { getInfo } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
						const info = await getInfo()
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: $network,
									timestampMs: Date.now(),
									source: Source.MoneroDaemonRpc_JsonRpc,
								},
								[EntityMetaKey.Fields]: Object.fromEntries(
									Object.entries(moneroNetworkTimestampFields(info)).map(([fieldName, value]) => [
										entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], fieldName),
										value,
									])
								),
							},
						]
					},
				}
			},
		})({
				$$timestamps: {
					select: (timestamps) => timestamps,
					resolveCount: (timestamps) => timestamps.length,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertMoneroMainnet(network)
						const { getInfo } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
						const info = await getInfo()
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: network,
									timestampMs: Date.now(),
									source: Source.MoneroDaemonRpc_JsonRpc,
								},
								[EntityMetaKey.Fields]: Object.fromEntries(
									Object.entries(moneroNetworkTimestampFields(info)).map(([fieldName, value]) => [
										entityFieldAddressKey(EntityType.MoneroNetwork_Timestamp, [], fieldName),
										value,
									])
								),
							},
						]
					},
				}
			},
		})({
				Monero: {
					$$timestamps: {
						select: (timestamps) => timestamps,
						resolveCount: (timestamps) => timestamps.length,
					},
				},
			}),

		defineResolver({
			entityType: EntityType.MoneroNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertMoneroMainnet($network)
						const { getInfo } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
						const info = await getInfo()
						const headBlockHeight = BigInt(info.height - 1)
						return {
							blockCount: info.height,
							blocks: Array.from({
								length: Math.min(
									info.height,
									resolverContextRowLimit(context)
								),
							}, (_value, blockOffset) => ({
								[EntityMetaKey.Selector]: {
									$network: $network,
									height: headBlockHeight - BigInt(blockOffset),
									...(blockOffset === 0 && {
										hash: info.top_block_hash,
									}),
								},
							})),
						}
					},
				}
			},
		})({
				$$blocks: {
					select: (snapshot) => snapshot.blocks,
					resolveCount: (snapshot) => snapshot.blockCount,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertMoneroMainnet(network)
						const { getInfo } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
						const info = await getInfo()
						const headBlockHeight = BigInt(info.height - 1)
						return {
							blockCount: info.height,
							blocks: Array.from({
								length: Math.min(
									info.height,
									resolverContextRowLimit(context)
								),
							}, (_value, blockOffset) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									height: headBlockHeight - BigInt(blockOffset),
									...(blockOffset === 0 && {
										hash: info.top_block_hash,
									}),
								},
							})),
						}
					},
				}
			},
		})({
				Monero: {
					$$blocks: {
						select: (snapshot) => snapshot.blocks,
						resolveCount: (snapshot) => snapshot.blockCount,
					},
				},
			}),

	],
} satisfies RegisteredSourceResolverModule
