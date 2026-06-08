import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	moneroDaemonDefaultRpcUrl,
	moneroMainnetRpcEndpoints,
} from '$/constants/MoneroNetwork.ts'
import { caip2ByNetworkSlug } from '$/constants/Network.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	MoneroRpcInfo,
	MoneroRpcTransaction,
	MoneroRpcTransactionInput,
	MoneroRpcTransactionOutput,
} from '$/sources/MoneroDaemonRpc/JsonRpc/types.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const moneroMainnetCaip2 = caip2ByNetworkSlug.monero

const assertMoneroMainnet = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== moneroMainnetCaip2.namespace
		|| network.caip2.reference !== moneroMainnetCaip2.reference
	) {
		throw new Error('MoneroDaemonRpc_JsonRpc: unsupported network')
	}
}

const moneroTransactionOutputFields = (
	transaction: MoneroRpcTransaction,
	output: MoneroRpcTransactionOutput,
	outputIndex: number,
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
	inputIndex: number,
) => ({
	...(input.key != null && {
		$ring: {
			[EntityMetaKey.Id]: {
				$keyImage: {
					$transaction: transactionId,
					inputIndex,
					keyImage: input.key.k_image,
				},
			},
		},
	}),
})

const moneroRingMemberFields = (
	input: MoneroRpcTransactionInput,
	memberIndex: number,
) => (
	input.key?.key_offsets[memberIndex] == null ?
		{}
	:
		{
			globalOutputIndex: BigInt(input.key.key_offsets[memberIndex]),
		}
)

const moneroTransactionFields = (
	network: NetworkId,
	transaction: MoneroRpcTransaction,
) => ({
	...(!transaction.in_pool && {
		$block: {
			[EntityMetaKey.Id]: {
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
					[EntityMetaKey.Id]: {
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
						inputIndex,
					),
				},
			]
		)),
		$$stealthOutputs: transaction.decoded_json.vout.map((output, outputIndex) => ({
			[EntityMetaKey.Id]: {
				$transaction: {
					$network: network,
					txHash: transaction.tx_hash,
				},
				outputIndex,
			},
			...moneroTransactionOutputFields(
				transaction,
				output,
				outputIndex,
			),
		})),
	}),
})

const getMoneroTransaction = async (entityId: {
	$network: NetworkId
	txHash: string
}) => {
	assertMoneroMainnet(entityId.$network)
	const { getTransactions } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
	const transaction = (await getTransactions({
		rpcUrl: moneroDaemonDefaultRpcUrl,
		txHashes: [entityId.txHash],
	})).txs.at(0)
	if (transaction == null) {
		throw new Error(`MoneroDaemonRpc_JsonRpc: transaction not found for hash ${entityId.txHash}`)
	}
	return transaction
}

export default {
	source: Source.MoneroDaemonRpc_JsonRpc,

	resolvers: [
		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertMoneroMainnet(entityId)
					return {
						$network: {
							[EntityMetaKey.Id]: entityId,
						},
						rpcEndpoints: [...moneroMainnetRpcEndpoints],
					}
				}
			},
			fields: {
					$network: (network) => network.$network,
					rpcEndpoints: (network) => network.rpcEndpoints,
				}
		}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertMoneroMainnet(entityId.$network)
					const { getBlock } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
					const block = await getBlock({
						rpcUrl: moneroDaemonDefaultRpcUrl,
						height: entityId.height,
					})
					return {
						hash: block.block_header.hash,
						...(block.block_header.height > 0 && {
							$parent: {
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
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
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								txHash,
							},
							$block: {
								[EntityMetaKey.Id]: entityId,
							},
						})),
					}
				}
			},
			fields: {
					hash: (block) => block.hash,
					$parent: (block) => block.$parent,
					timestampMs: (block) => block.timestampMs,
					difficulty: (block) => block.difficulty,
					weightBytes: (block) => block.weightBytes,
					$$transactions: (block) => block.$$transactions,
				}
		}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => (
					moneroTransactionFields(
						entityId.$network,
						await getMoneroTransaction(entityId),
					)
				)
			},
			fields: {
					$block: (transaction) => transaction.$block,
					version: (transaction) => transaction.version,
					unlockTime: (transaction) => transaction.unlockTime,
					feeAtomicUnits: (transaction) => transaction.feeAtomicUnits,
					$$keyImages: (transaction) => transaction.$$keyImages,
					$$stealthOutputs: (transaction) => transaction.$$stealthOutputs,
				}
		}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroKeyImage,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					const transaction = await getMoneroTransaction(entityId.$transaction)
					const input = transaction.decoded_json?.vin[entityId.inputIndex]
					if (input?.key == null || input.key.k_image !== entityId.keyImage) {
						throw new Error(`MoneroDaemonRpc_JsonRpc: key image ${entityId.keyImage} not found for ${entityId.$transaction.txHash}`)
					}
					return moneroKeyImageFields(
						entityId.$transaction,
						input,
						entityId.inputIndex,
					)
				}
			},
			fields: {
					$ring: (keyImage) => keyImage.$ring,
				}
		}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroRing,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					const transaction = await getMoneroTransaction(entityId.$keyImage.$transaction)
					const input = transaction.decoded_json?.vin[entityId.$keyImage.inputIndex]
					if (input?.key == null || input.key.k_image !== entityId.$keyImage.keyImage) {
						throw new Error(`MoneroDaemonRpc_JsonRpc: ring not found for key image ${entityId.$keyImage.keyImage}`)
					}
					return {
						$$members: input.key.key_offsets.map((_keyOffset, memberIndex) => ({
							[EntityMetaKey.Id]: {
								$ring: entityId,
								memberIndex,
							},
							...moneroRingMemberFields(
								input,
								memberIndex,
							),
						})),
					}
				}
			},
			fields: {
					$$members: (ring) => ring.$$members,
				}
		}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroRingMember,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					const transaction = await getMoneroTransaction(entityId.$ring.$keyImage.$transaction)
					const input = transaction.decoded_json?.vin[entityId.$ring.$keyImage.inputIndex]
					if (input?.key == null || input.key.k_image !== entityId.$ring.$keyImage.keyImage) {
						throw new Error(`MoneroDaemonRpc_JsonRpc: ring member ${entityId.memberIndex.toString()} not found for key image ${entityId.$ring.$keyImage.keyImage}`)
					}
					return moneroRingMemberFields(
						input,
						entityId.memberIndex,
					)
				}
			},
			fields: {
					globalOutputIndex: (ringMember) => ringMember.globalOutputIndex,
				}
		}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroStealthOutput,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					const transaction = await getMoneroTransaction(entityId.$transaction)
					const output = transaction.decoded_json?.vout[entityId.outputIndex]
					if (output == null) {
						throw new Error(`MoneroDaemonRpc_JsonRpc: stealth output ${entityId.outputIndex.toString()} not found for ${entityId.$transaction.txHash}`)
					}
					return moneroTransactionOutputFields(
						transaction,
						output,
						entityId.outputIndex,
					)
				}
			},
			fields: {
					publicKey: (output) => output.publicKey,
					commitment: (output) => output.commitment,
				}
		}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					assertMoneroMainnet(entityId)
					const { getInfo } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
					const info = await getInfo({
						rpcUrl: moneroDaemonDefaultRpcUrl,
					})
					return [
						{
							[EntityMetaKey.Id]: {
								$network: entityId,
								timestampMs: Date.now(),
							},
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
						},
					]
				}
			},
			fields: {
					$$timestamps: (timestamps) => timestamps,
				}
		}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
					assertMoneroMainnet(entityId)
					const { getInfo } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
					const info = await getInfo({
						rpcUrl: moneroDaemonDefaultRpcUrl,
					})
					const headBlockHeight = BigInt(info.height - 1)
					return Array.from({
						length: Math.min(
							Number(headBlockHeight + 1n),
							resolverContextRowLimit(context),
						),
					}, (_value, blockOffset) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							height: headBlockHeight - BigInt(blockOffset),
							...(blockOffset === 0 && {
								hash: info.top_block_hash,
							}),
						},
					}))
				}
			},
			fields: {
					$$blocks: (blocks) => blocks,
				}
		}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroRing,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
					const transaction = await getMoneroTransaction(entityId.$keyImage.$transaction)
					const input = transaction.decoded_json?.vin[entityId.$keyImage.inputIndex]
					if (input?.key == null || input.key.k_image !== entityId.$keyImage.keyImage) {
						throw new Error(`MoneroDaemonRpc_JsonRpc: ring not found for key image ${entityId.$keyImage.keyImage}`)
					}
					return input.key.key_offsets.map((_keyOffset, memberIndex) => ({
						[EntityMetaKey.Id]: {
							$ring: entityId,
							memberIndex,
						},
						...moneroRingMemberFields(
							input,
							memberIndex,
						),
					}))
				}
			},
			fields: {
					$$members: (members) => members,
				}
		}),
	],
}
