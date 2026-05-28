import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const mempoolSpaceBitcoinMainnetRestBaseUrl = 'https://mempool.space/api'

const assertBitcoinMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== 'bip122'
		|| network.caip2.reference !== '000000000019d6689c085ae165831e93'
	) {
		throw new Error('MempoolSpace_Rest: unsupported Bitcoin network')
	}
}

const getTransaction = async (entityId: {
	$network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }
	txId: string
}) => {
	assertBitcoinMainnet(entityId.$network)
	const { getTransaction } = await import('$/sources/MempoolSpace/Rest/queries.ts')
	return getTransaction({
		restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
		txId: entityId.txId,
	})
}

export default {
	source: Source.MempoolSpace_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.UtxoBlock,
			resolve: async (entityId) => {
				assertBitcoinMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHashByHeight,
				} = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const block = await getBlock({
					restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
					blockHash: entityId.hash ?? await getBlockHashByHeight({
						restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
						height: entityId.height,
					}),
				})
				return {
					hash: block.id,
					...(block.previousblockhash != null && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(block.height - 1),
								hash: block.previousblockhash,
							},
						},
					}),
					timestampMs: block.timestamp * 1000,
					merkleRoot: block.merkle_root,
					nonce: BigInt(block.nonce),
					difficulty: block.difficulty,
					sizeBytes: block.size,
					weightUnits: block.weight,
					transactionCount: block.tx_count,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: async (entityId) => {
				const transaction = await getTransaction(entityId)
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						txId: transaction.txid,
					},
					...(transaction.status.block_height != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(transaction.status.block_height),
								...(transaction.status.block_hash != null && {
									hash: transaction.status.block_hash,
								}),
							},
						},
					}),
					version: transaction.version,
					lockTime: transaction.locktime,
					sizeBytes: transaction.size,
					weightUnits: transaction.weight,
					virtualSizeBytes: Math.ceil(transaction.weight / 4),
					...(transaction.fee != null && {
						feeSats: BigInt(transaction.fee),
					}),
					isCoinbase: transaction.vin.some((input) => input.is_coinbase),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoInput,
			resolve: async (entityId) => {
				const input = (await getTransaction(entityId.$transaction)).vin[entityId.inputIndex]
				return {
					[EntityMetaKey.Id]: {
						$transaction: entityId.$transaction,
						inputIndex: entityId.inputIndex,
					},
					...(input.txid != null && input.vout != null && {
						$spentOutput: {
							[EntityMetaKey.Id]: {
								$transaction: {
									$network: entityId.$transaction.$network,
									txId: input.txid,
								},
								outputIndex: input.vout,
							},
						},
					}),
					...(input.scriptsig != null && {
						coinbaseScript: input.scriptsig,
					}),
					...(input.scriptsig_asm != null && {
						scriptSigAsm: input.scriptsig_asm,
					}),
					sequence: BigInt(input.sequence),
					...(input.witness != null && {
						witness: input.witness,
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoOutput,
			resolve: async (entityId) => {
				const output = (await getTransaction(entityId.$transaction)).vout[entityId.outputIndex]
				return {
					[EntityMetaKey.Id]: {
						$transaction: entityId.$transaction,
						outputIndex: entityId.outputIndex,
					},
					valueSats: BigInt(output.value),
					...(output.scriptpubkey_asm != null && {
						scriptPubKeyAsm: output.scriptpubkey_asm,
					}),
					scriptPubKeyHex: output.scriptpubkey,
					scriptPubKeyType: output.scriptpubkey_type,
					...(output.scriptpubkey_address != null && {
						address: output.scriptpubkey_address,
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.UtxoBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				assertBitcoinMainnet(entityId.$network)
				const {
					getBlockHashByHeight,
					getBlockTransactionIds,
				} = await import('$/sources/MempoolSpace/Rest/queries.ts')
				return (
					await getBlockTransactionIds({
						restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
						blockHash: entityId.hash ?? await getBlockHashByHeight({
							restBaseUrl: mempoolSpaceBitcoinMainnetRestBaseUrl,
							height: entityId.height,
						}),
					})
				).map((txId) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						txId,
					},
				}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoTransaction,
			fieldName: '$$inputs',
			resolve: async (entityId) => (
				(await getTransaction(entityId)).vin.map((input, inputIndex) => (
					{
						[EntityMetaKey.Id]: {
							$transaction: entityId,
							inputIndex,
						},
						...(input.txid != null && input.vout != null && {
							$spentOutput: {
								[EntityMetaKey.Id]: {
									$transaction: {
										$network: entityId.$network,
										txId: input.txid,
									},
									outputIndex: input.vout,
								},
							},
						}),
						...(input.scriptsig != null && {
							coinbaseScript: input.scriptsig,
						}),
						...(input.scriptsig_asm != null && {
							scriptSigAsm: input.scriptsig_asm,
						}),
						sequence: BigInt(input.sequence),
						...(input.witness != null && {
							witness: input.witness,
						}),
					}
				))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoTransaction,
			fieldName: '$$outputs',
			resolve: async (entityId) => (
				(await getTransaction(entityId)).vout.map((output, outputIndex) => (
					{
						[EntityMetaKey.Id]: {
							$transaction: entityId,
							outputIndex,
						},
						valueSats: BigInt(output.value),
						...(output.scriptpubkey_asm != null && {
							scriptPubKeyAsm: output.scriptpubkey_asm,
						}),
						scriptPubKeyHex: output.scriptpubkey,
						scriptPubKeyType: output.scriptpubkey_type,
						...(output.scriptpubkey_address != null && {
							address: output.scriptpubkey_address,
						}),
					}
				))
			),
		}),
	],
}
