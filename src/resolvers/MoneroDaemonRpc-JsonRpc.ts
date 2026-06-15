import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { stringify } from 'devalue'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	moneroDaemonDefaultRpcUrl,
	moneroMainnetRpcEndpoints,
} from '$/constants/MoneroNetwork.ts'
import { caip2ByNetworkSlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	MoneroRpcInfo,
	MoneroRpcTransaction,
	MoneroRpcTransactionInput,
	MoneroRpcTransactionOutput,
} from '$/sources/MoneroDaemonRpc/JsonRpc/types.ts'
import { MoneroNetworkSelector } from '$/schema/MoneroNetwork.ts'
import { MoneroBlockSelector } from '$/schema/MoneroBlock.ts'
import { MoneroTransactionSelector } from '$/schema/MoneroTransaction.ts'
import { MoneroKeyImageSelector } from '$/schema/MoneroKeyImage.ts'
import { MoneroRingSelector } from '$/schema/MoneroRing.ts'
import { MoneroRingMemberSelector } from '$/schema/MoneroRingMember.ts'
import { MoneroStealthOutputSelector } from '$/schema/MoneroStealthOutput.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const moneroMainnetCaip2 = caip2ByNetworkSlug.monero

const assertMoneroMainnet = (network: NetworkId) => {
	if (stringify(network) !== stringify({ caip2: moneroMainnetCaip2 })) {
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
						inputIndex,
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
				outputIndex,
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
		rpcUrl: moneroDaemonDefaultRpcUrl,
		txHashes: [txHash],
	})).txs.at(0)
	if (transaction == null) {
		throw new Error(`MoneroDaemonRpc_JsonRpc: transaction not found for hash ${txHash}`)
	}
	return transaction
}

export default {
	source: Source.MoneroDaemonRpc_JsonRpc,

	resolvers: [
		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroNetwork,
			resolve: {
				[MoneroNetworkSelector.Network]: async (entitySelector) => {
					assertMoneroMainnet(entitySelector.$network)
					return {
						$network: {
							[EntityMetaKey.Selector]: entitySelector.$network,
						},
						rpcEndpoints: [...moneroMainnetRpcEndpoints],
					}
				}
			}
		})({
				fields: {
					$network: (network) => network.$network,
					rpcEndpoints: (network) => network.rpcEndpoints,
				},
			}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroBlock,
			resolve: {
				[MoneroBlockSelector.NetworkHeightHash]: async ({ $network, height }) => {
					assertMoneroMainnet($network)
					const { getBlock } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
					const block = await getBlock({
						rpcUrl: moneroDaemonDefaultRpcUrl,
						height: height,
					})
					return {
						hash: block.block_header.hash,
						...(block.block_header.height > 0 && {
							$parent: {
								[EntityMetaKey.Selector]: {
									$network: $network,
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
								$network,
								txHash,
							},
							$block: {
								[EntityMetaKey.Selector]: {
									$network,
									height,
									hash: block.block_header.hash,
								},
							},
						})),
					}
				}
			}
		})({
				fields: {
					hash: (block) => block.hash,
					$parent: (block) => block.$parent,
					timestampMs: (block) => block.timestampMs,
					difficulty: (block) => block.difficulty,
					weightBytes: (block) => block.weightBytes,
					$$transactions: (block) => block.$$transactions,
				},
			}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroTransaction,
			resolve: {
				[MoneroTransactionSelector.NetworkTxHash]: async (entitySelector) => (
					moneroTransactionFields(
						entitySelector.$network,
						await getMoneroTransaction(entitySelector),
					)
				)
			}
		})({
				fields: {
					$block: (transaction) => transaction.$block,
					version: (transaction) => transaction.version,
					unlockTime: (transaction) => transaction.unlockTime,
					feeAtomicUnits: (transaction) => transaction.feeAtomicUnits,
					$$keyImages: (transaction) => transaction.$$keyImages ?? [],
					$$stealthOutputs: (transaction) => transaction.$$stealthOutputs ?? [],
				},
			}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroKeyImage,
			resolve: {
				[MoneroKeyImageSelector.MoneroTransactionInputIndexKeyImage]: async ({ $transaction, inputIndex, keyImage }) => {
					const transaction = await getMoneroTransaction($transaction)
					const input = transaction.decoded_json?.vin[inputIndex]
					if (input?.key == null || input.key.k_image !== keyImage) {
						throw new Error(`MoneroDaemonRpc_JsonRpc: key image ${keyImage} not found for ${$transaction.txHash}`)
					}
					return moneroKeyImageFields(
						$transaction,
						input,
						inputIndex,
					)
				}
			}
		})({
				fields: {
					$ring: (keyImage) => keyImage.$ring,
				},
			}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroRing,
			resolve: {
				[MoneroRingSelector.MoneroKeyImage]: async ({ $keyImage }) => {
					const transaction = await getMoneroTransaction($keyImage.$transaction)
					const input = transaction.decoded_json?.vin[$keyImage.inputIndex]
					if (input?.key == null || input.key.k_image !== $keyImage.keyImage) {
						throw new Error(`MoneroDaemonRpc_JsonRpc: ring not found for key image ${$keyImage.keyImage}`)
					}
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
								memberIndex,
							),
						})),
					}
				}
			}
		})({
				fields: {
					$$members: (ring) => ring.$$members,
				},
			}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroRingMember,
			resolve: {
				[MoneroRingMemberSelector.MoneroRingMemberIndex]: async ({ $ring, memberIndex }) => {
					const transaction = await getMoneroTransaction($ring.$keyImage.$transaction)
					const input = transaction.decoded_json?.vin[$ring.$keyImage.inputIndex]
					if (input?.key == null || input.key.k_image !== $ring.$keyImage.keyImage) {
						throw new Error(`MoneroDaemonRpc_JsonRpc: ring member ${memberIndex.toString()} not found for key image ${$ring.$keyImage.keyImage}`)
					}
					return moneroRingMemberFields(
						input,
						memberIndex,
					)
				}
			}
		})({
				fields: {
					globalOutputIndex: (ringMember) => ringMember.globalOutputIndex,
				},
			}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroStealthOutput,
			resolve: {
				[MoneroStealthOutputSelector.MoneroTransactionOutputIndex]: async ({ $transaction, outputIndex }) => {
					const transaction = await getMoneroTransaction($transaction)
					const output = transaction.decoded_json?.vout[outputIndex]
					if (output == null) {
						throw new Error(`MoneroDaemonRpc_JsonRpc: stealth output ${outputIndex.toString()} not found for ${$transaction.txHash}`)
					}
					return moneroTransactionOutputFields(
						transaction,
						output,
						outputIndex,
					)
				}
			}
		})({
				fields: {
					publicKey: (output) => output.publicKey,
					commitment: (output) => output.commitment,
				},
			}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroNetwork,
			resolve: {
				[MoneroNetworkSelector.Network]: async (entitySelector) => {
					assertMoneroMainnet(entitySelector.$network)
					const { getInfo } = await import('$/sources/MoneroDaemonRpc/JsonRpc/queries.ts')
					const info = await getInfo({
						rpcUrl: moneroDaemonDefaultRpcUrl,
					})
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
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
			}
		})({
				fields: {
					$$timestamps: (timestamps) => timestamps,
				},
			}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroNetwork,
			resolve: {
				[MoneroNetworkSelector.Network]: async (entitySelector, context) => {
					assertMoneroMainnet(entitySelector.$network)
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
						[EntityMetaKey.Selector]: {
							$network: entitySelector.$network,
							height: headBlockHeight - BigInt(blockOffset),
							...(blockOffset === 0 && {
								hash: info.top_block_hash,
							}),
						},
					}))
				}
			}
		})({
				fields: {
					$$blocks: (blocks) => blocks,
				},
			}),

		defineResolver(Source.MoneroDaemonRpc_JsonRpc, {
			entityType: EntityType.MoneroRing,
			resolve: {
				[MoneroRingSelector.MoneroKeyImage]: async ({ $keyImage }) => {
					const transaction = await getMoneroTransaction($keyImage.$transaction)
					const input = transaction.decoded_json?.vin[$keyImage.inputIndex]
					if (input?.key == null || input.key.k_image !== $keyImage.keyImage) {
						throw new Error(`MoneroDaemonRpc_JsonRpc: ring not found for key image ${$keyImage.keyImage}`)
					}
					return input.key.key_offsets.map((_keyOffset, memberIndex) => ({
						[EntityMetaKey.Selector]: {
							$ring: {
								$keyImage,
							},
							memberIndex,
						},
						...moneroRingMemberFields(
							input,
							memberIndex,
						),
					}))
				}
			}
		})({
				fields: {
					$$members: (members) => members,
				},
			}),
	],
}
