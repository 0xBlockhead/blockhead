import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	bitcoinOrdinalInscriptionRefsFromPayloads,
	bitcoinOrdinalInscriptionSnapshotFromPayload,
	bitcoinRunestoneRefFromPayloads,
	bitcoinRunestoneSnapshotFromPayload,
	ordinalsPayloads,
	parseBitcoinInscriptionId,
	runestonePayload,
} from '$/resolvers/bitcoinOrdinalsRunes.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	networkBySlug,
	NetworkExecutionModel,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type MempoolSpaceBlock = Awaited<ReturnType<
	typeof import('$/sources/MempoolSpace/Rest/queries.ts').getBlocks
>>[number]
type MempoolSpaceTransaction = Awaited<ReturnType<
	typeof import('$/sources/MempoolSpace/Rest/queries.ts').getTransaction
>>

const utxoBlockReferenceFromMempoolSpaceWire = (
	$network: NetworkId,
	block: MempoolSpaceBlock
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		height: BigInt(block.height),
		hash: block.id,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.UtxoBlock, [], 'height')]: BigInt(block.height),
		[entityFieldAddressKey(EntityType.UtxoBlock, [], 'hash')]: block.id,
		...(block.previousblockhash != null && block.height > 0 && {
			[entityFieldAddressKey(EntityType.UtxoBlock, [], '$parent')]: {
				[EntityMetaKey.Selector]: {
					$network,
					height: BigInt(block.height - 1),
					hash: block.previousblockhash,
				},
			},
		}),
		[entityFieldAddressKey(EntityType.UtxoBlock, [], 'timestampMs')]: block.timestamp * 1_000,
		...(block.merkle_root != null && {
			[entityFieldAddressKey(EntityType.UtxoBlock, [], 'merkleRoot')]: block.merkle_root,
		}),
		...(block.nonce != null && {
			[entityFieldAddressKey(EntityType.UtxoBlock, [], 'nonce')]: block.nonce,
		}),
		...(block.difficulty != null && {
			[entityFieldAddressKey(EntityType.UtxoBlock, [], 'difficulty')]: block.difficulty,
		}),
		...(block.size != null && {
			[entityFieldAddressKey(EntityType.UtxoBlock, [], 'sizeBytes')]: block.size,
		}),
		...(block.weight != null && {
			[entityFieldAddressKey(EntityType.UtxoBlock, [], 'weightUnits')]: block.weight,
		}),
		[entityFieldAddressKey(EntityType.UtxoBlock, [], 'transactionCount')]: block.tx_count,
	},
})

const utxoTransactionReferenceFromMempoolSpaceWire = (
	$network: NetworkId,
	transaction: MempoolSpaceTransaction
) => {
	const $transaction = {
		$network,
		txId: transaction.txid,
	}
	return {
		[EntityMetaKey.Selector]: $transaction,
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'version')]: transaction.version,
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'lockTime')]: transaction.locktime,
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'sizeBytes')]: transaction.size,
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'weightUnits')]: transaction.weight,
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: Math.ceil(transaction.weight / 4),
			...(transaction.fee != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: BigInt(transaction.fee),
			}),
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'isCoinbase')]: transaction.vin.some((input) => input.is_coinbase),
			...(transaction.status.block_height != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network,
						height: BigInt(transaction.status.block_height),
						...(transaction.status.block_hash != null && {
							hash: transaction.status.block_hash,
						}),
					},
				},
			}),
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$inputs')]: transaction.vin.map((input, indexInTransaction) => ({
				[EntityMetaKey.Selector]: {
					$transaction,
					indexInTransaction,
				},
				[EntityMetaKey.Fields]: {
					...(input.txid != null && input.vout != null && {
						[entityFieldAddressKey(EntityType.UtxoInput, [], '$spentOutput')]: {
							[EntityMetaKey.Selector]: {
								$transaction: {
									$network,
									txId: input.txid,
								},
								indexInTransaction: input.vout,
							},
						},
					}),
					[entityFieldAddressKey(EntityType.UtxoInput, [], 'sequence')]: input.sequence,
					[entityFieldAddressKey(EntityType.UtxoInput, [], 'witness')]: input.witness ?? [],
				},
			})),
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$outputs')]: transaction.vout.map((output, indexInTransaction) => ({
				[EntityMetaKey.Selector]: {
					$transaction,
					indexInTransaction,
				},
				[EntityMetaKey.Fields]: {
					...(output.value != null && {
						[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: BigInt(output.value),
					}),
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: output.scriptpubkey,
					...(output.scriptpubkey_type != null && {
						[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyType')]: output.scriptpubkey_type,
					}),
					...(output.scriptpubkey_address != null && {
						[entityFieldAddressKey(EntityType.UtxoOutput, [], '$address')]: {
							[EntityMetaKey.Selector]: {
								$network,
								address: output.scriptpubkey_address,
							},
						},
					}),
				},
			})),
		},
	}
}

const bitcoinNetworkApplicability = [
	{
		caip2: networkBySlug.bitcoin.caip2,
	},
	{
		slug: 'bitcoin',
	},
] as const

const bitcoinNetworkReferenceApplicability = [
	{
		$network: bitcoinNetworkApplicability[0],
	},
	{
		$network: bitcoinNetworkApplicability[1],
	},
] as const

const bitcoinNetworkTimestampApplicability = [
	{
		...bitcoinNetworkReferenceApplicability[0],
		source: Source.MempoolSpace_Rest,
	},
	{
		...bitcoinNetworkReferenceApplicability[1],
		source: Source.MempoolSpace_Rest,
	},
] as const

const bitcoinAddressTimestampApplicability = [
	{
		$address: bitcoinNetworkReferenceApplicability[0],
		source: Source.MempoolSpace_Rest,
	},
	{
		$address: bitcoinNetworkReferenceApplicability[1],
		source: Source.MempoolSpace_Rest,
	},
] as const

const bitcoinTransactionReferenceApplicability = [
	{
		$transaction: bitcoinNetworkReferenceApplicability[0],
	},
	{
		$transaction: bitcoinNetworkReferenceApplicability[1],
	},
] as const

const assertBitcoinMainnet = (network: NetworkId) => {
	if (
		(
			!('caip2' in network)
			|| network.caip2.namespace !== networkBySlug.bitcoin.caip2.namespace
			|| network.caip2.reference !== networkBySlug.bitcoin.caip2.reference
		)
		&& (
			!('slug' in network)
			|| network.slug !== 'bitcoin'
		)
	)
		throw new Error('MempoolSpace_Rest: unsupported Bitcoin network')
}

const bitcoinMainnet = {
	caip2: networkBySlug.bitcoin.caip2,
} as const

const bitcoinNetworkSelectors = <_Snapshot extends object>(
	resolve: (
		network: NetworkId,
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Caip2: {
		appliesTo: [bitcoinNetworkApplicability[0]],
		resolve,
	},
	Slug: {
		appliesTo: [bitcoinNetworkApplicability[1]],
		resolve,
	},
})

const getTransaction = async ({ $network, txId }: {
	$network: NetworkId
	txId: string
}) => {
	assertBitcoinMainnet($network)
	const { getTransaction } = await import('$/sources/MempoolSpace/Rest/queries.ts')
	return getTransaction(txId)
}

const utxoBlockSnapshot = async (
	$network: NetworkId,
	hash: string
) => {
	assertBitcoinMainnet($network)
	const {
		getBlock,
	} = await import('$/sources/MempoolSpace/Rest/queries.ts')
	const block = await getBlock(hash)
	return {
		hash: block.id,
		...(block.previousblockhash != null && {
			$parent: {
				[EntityMetaKey.Selector]: {
					$network: $network,
					height: BigInt(block.height - 1),
					hash: block.previousblockhash,
				},
			},
		}),
		timestampMs: block.timestamp * 1000,
		merkleRoot: block.merkle_root,
		nonce: block.nonce,
		difficulty: block.difficulty,
		sizeBytes: block.size,
		weightUnits: block.weight,
		transactionCount: block.tx_count,
	}
}

export default {
	source: Source.MempoolSpace_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: bitcoinNetworkReferenceApplicability,
					resolve: async ({ $network, height }) => {
						assertBitcoinMainnet($network)
						const {
							getBlockHashByHeight,
						} = await import('$/sources/MempoolSpace/Rest/queries.ts')
						return utxoBlockSnapshot(
							$network,
							await getBlockHashByHeight(height)
						)
					},
				},
				NetworkHeightHash: {
					appliesTo: bitcoinNetworkReferenceApplicability,
					resolve: async ({ $network, hash }) => (
						utxoBlockSnapshot($network, hash)
					),
				}
			},
		})({
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				timestampMs: (block) => block.timestampMs,
				merkleRoot: (block) => block.merkleRoot,
				nonce: (block) => block.nonce,
				difficulty: (block) => block.difficulty,
				sizeBytes: (block) => block.sizeBytes,
				weightUnits: (block) => block.weightUnits,
				transactionCount: (block) => block.transactionCount,
			}),

		defineResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: {
				NetworkTxId: {
					appliesTo: bitcoinNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						const transaction = await getTransaction(entitySelector)
						const payloads = (
							await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
						).extractEsploraProtocolPayloads(transaction)
						const $bitcoinRunestone = bitcoinRunestoneRefFromPayloads(entitySelector, payloads)
						return {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								txId: transaction.txid,
							},
							...(transaction.status.block_height != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network: entitySelector.$network,
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
							$$inputs: transaction.vin.map((input, indexInTransaction) => ({
								[EntityMetaKey.Selector]: {
									$transaction: entitySelector,
									indexInTransaction,
								},
								[EntityMetaKey.Fields]: {
									...(input.txid != null && input.vout != null && {
										[entityFieldAddressKey(EntityType.UtxoInput, [], '$spentOutput')]: {
											[EntityMetaKey.Selector]: {
												$transaction: {
													$network: entitySelector.$network,
													txId: input.txid,
												},
												indexInTransaction: input.vout,
											},
										},
									}),
									...(input.is_coinbase && input.scriptsig != null && {
										[entityFieldAddressKey(EntityType.UtxoInput, [], 'coinbaseScript')]: input.scriptsig,
									}),
									...(!input.is_coinbase && input.scriptsig_asm != null && {
										[entityFieldAddressKey(EntityType.UtxoInput, [], 'scriptSigAsm')]: input.scriptsig_asm,
									}),
									[entityFieldAddressKey(EntityType.UtxoInput, [], 'sequence')]: input.sequence,
									[entityFieldAddressKey(EntityType.UtxoInput, [], 'witness')]: input.witness ?? [],
								},
							})),
							$$outputs: transaction.vout.map((output, indexInTransaction) => ({
								[EntityMetaKey.Selector]: {
									$transaction: entitySelector,
									indexInTransaction,
								},
								[EntityMetaKey.Fields]: {
									...(output.value != null && {
										[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: BigInt(output.value),
									}),
									...(output.scriptpubkey_asm != null && {
										[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyAsm')]: output.scriptpubkey_asm,
									}),
									[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: output.scriptpubkey,
									...(output.scriptpubkey_type != null && {
										[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyType')]: output.scriptpubkey_type,
									}),
									...(output.scriptpubkey_address != null && {
										[entityFieldAddressKey(EntityType.UtxoOutput, [], '$address')]: {
											[EntityMetaKey.Selector]: {
												$network: entitySelector.$network,
												address: output.scriptpubkey_address,
											},
										},
									}),
								},
							})),
							$$bitcoinOrdinalInscriptions: bitcoinOrdinalInscriptionRefsFromPayloads(
								entitySelector.$network,
								payloads
							),
							...($bitcoinRunestone != null && {
								$bitcoinRunestone,
							}),
						}
					},
				}
			},
		})({
				$block: (transaction) => transaction.$block,
				version: (transaction) => transaction.version,
				lockTime: (transaction) => transaction.lockTime,
				sizeBytes: (transaction) => transaction.sizeBytes,
				weightUnits: (transaction) => transaction.weightUnits,
				virtualSizeBytes: (transaction) => transaction.virtualSizeBytes,
				feeSats: (transaction) => transaction.feeSats,
				isCoinbase: (transaction) => transaction.isCoinbase,
				$$inputs: (transaction) => transaction.$$inputs,
				$$outputs: (transaction) => transaction.$$outputs,
				$$bitcoinOrdinalInscriptions: (transaction) => transaction.$$bitcoinOrdinalInscriptions,
				$bitcoinRunestone: (transaction) => transaction.$bitcoinRunestone,
			}),

		defineResolver({
			entityType: EntityType.UtxoInput,
			resolve: {
				TransactionIndexInTransaction: {
					appliesTo: bitcoinTransactionReferenceApplicability,
					resolve: async ({ $transaction, indexInTransaction }) => {
						const input = (await getTransaction($transaction)).vin.at(indexInTransaction)
						if (input == null)
							throw new Error(`MempoolSpace_Rest: transaction input ${indexInTransaction} not found`)

						return {
							[EntityMetaKey.Selector]: {
								$transaction: $transaction,
								indexInTransaction: indexInTransaction,
							},
							...(input.txid != null && input.vout != null && {
								$spentOutput: {
									[EntityMetaKey.Selector]: {
										$transaction: {
											$network: $transaction.$network,
											txId: input.txid,
										},
										indexInTransaction: input.vout,
									},
								},
							}),
							...(input.is_coinbase && input.scriptsig != null && {
								coinbaseScript: input.scriptsig,
							}),
							...(!input.is_coinbase && input.scriptsig_asm != null && {
								scriptSigAsm: input.scriptsig_asm,
							}),
							sequence: input.sequence,
							...(input.witness != null && {
								witness: input.witness,
							}),
						}
					},
				}
			},
		})({
				$spentOutput: (input) => input.$spentOutput,
				coinbaseScript: (input) => input.coinbaseScript,
				scriptSigAsm: (input) => input.scriptSigAsm,
				sequence: (input) => input.sequence,
				witness: (input) => input.witness ?? [],
			}),

		defineResolver({
			entityType: EntityType.UtxoAddress,
			resolve: {
					NetworkAddress: {
						appliesTo: bitcoinNetworkReferenceApplicability,
						resolve: async ({ $network, address: addressSelector }) => {
							assertBitcoinMainnet($network)
							return {
								address: addressSelector,
								$$timestamps: [
									{
										[EntityMetaKey.Selector]: {
											$address: {
												$network,
												address: addressSelector,
											},
											timestampMs: Date.now(),
											source: Source.MempoolSpace_Rest,
										},
									},
								],
							}
						},
					}
				},
			})({
					address: (address) => address.address,
					$$timestamps: (address) => address.$$timestamps,
				}),

		defineResolver({
			entityType: EntityType.UtxoAddress,
			resolve: {
				NetworkAddress: {
					appliesTo: bitcoinNetworkReferenceApplicability,
					resolve: async (utxoAddress, context) => {
						assertBitcoinMainnet(utxoAddress.$network)
						const limit = Math.min(resolverContextRowLimit(context), 25)
						if (!Number.isSafeInteger(limit) || limit < 1)
							throw new Error('MempoolSpace_Rest: invalid address transaction limit')

						const { getAddressTransactions } = await import('$/sources/MempoolSpace/Rest/queries.ts')
						const transactions = await getAddressTransactions(
							utxoAddress.address,
							context.providerContinuationToken
						)

						return {
							terminal: transactions.length < 25 && transactions.length <= limit,
							transactions: transactions.slice(0, limit),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: (page, utxoAddress) => page.transactions.map((transaction) => (
					utxoTransactionReferenceFromMempoolSpaceWire(
						utxoAddress.$network,
						transaction
					)
				)),
				continuation: (page, utxoAddress) => {
					const lastTransaction = page.transactions.at(-1)
					return (
						page.terminal || lastTransaction == null ?
							{
								operation: 'address-transactions',
								target: utxoAddress.address,
								terminal: true,
							}
						:
							{
								operation: 'address-transactions',
								target: utxoAddress.address,
								terminal: false,
								token: lastTransaction.txid,
							}
					)
				},
			},
		}),

		defineResolver({
			entityType: EntityType.UtxoAddress,
			resolve: {
				NetworkAddress: {
					appliesTo: bitcoinNetworkReferenceApplicability,
					resolve: async ({ $network, address }, context) => {
						assertBitcoinMainnet($network)
						const { getAddressUtxos } = await import('$/sources/MempoolSpace/Rest/queries.ts')
						return (
							await getAddressUtxos(address)
						)
							.slice(0, resolverContextRowLimit(context))
							.map((utxo) => ({
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network,
										txId: utxo.txid,
									},
									indexInTransaction: utxo.vout,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: BigInt(utxo.value),
									[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: false,
								},
							}))
					},
				},
			},
		})({
			$$outputs: (outputs) => outputs,
		}),

			defineResolver({
				entityType: EntityType.UtxoAddress_Timestamp,
				resolve: {
					AddressTimestampMsSource: {
						appliesTo: bitcoinAddressTimestampApplicability,
						resolve: async ({ $address }) => {
							assertBitcoinMainnet($address.$network)
							const { getAddress } = await import('$/sources/MempoolSpace/Rest/queries.ts')
							const address = await getAddress($address.address)
							const chainStats = address.chain_stats
							return {
								balanceSats: BigInt(chainStats.funded_txo_sum - chainStats.spent_txo_sum),
								transactionCount: chainStats.tx_count,
								unspentOutputCount: chainStats.funded_txo_count - chainStats.spent_txo_count,
								fundedOutputCount: chainStats.funded_txo_count,
								spentOutputCount: chainStats.spent_txo_count,
								fundedValueSats: BigInt(chainStats.funded_txo_sum),
								spentValueSats: BigInt(chainStats.spent_txo_sum),
								mempoolTransactionCount: address.mempool_stats.tx_count,
							}
						},
					}
				},
			})({
					balanceSats: (address) => address.balanceSats,
					transactionCount: (address) => address.transactionCount,
					unspentOutputCount: (address) => address.unspentOutputCount,
					fundedOutputCount: (address) => address.fundedOutputCount,
					spentOutputCount: (address) => address.spentOutputCount,
					fundedValueSats: (address) => address.fundedValueSats,
					spentValueSats: (address) => address.spentValueSats,
					mempoolTransactionCount: (address) => address.mempoolTransactionCount,
				}),

		defineResolver({
			entityType: EntityType.UtxoOutput,
			resolve: {
				TransactionIndexInTransaction: {
					appliesTo: bitcoinTransactionReferenceApplicability,
					resolve: async ({ $transaction, indexInTransaction }) => {
						const transaction = await getTransaction($transaction)
						const output = transaction.vout.at(indexInTransaction)
						if (output == null)
							throw new Error(`MempoolSpace_Rest: transaction output ${indexInTransaction} not found`)

						const runestone = runestonePayload(
							(
								await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
							).extractEsploraProtocolPayloads(transaction)
						)
						return {
							[EntityMetaKey.Selector]: {
								$transaction: $transaction,
								indexInTransaction: indexInTransaction,
							},
							valueSats: BigInt(output.value),
							...(output.scriptpubkey_asm != null && {
								scriptPubKeyAsm: output.scriptpubkey_asm,
							}),
							scriptPubKeyHex: output.scriptpubkey,
							scriptPubKeyType: output.scriptpubkey_type,
							...(output.scriptpubkey_address != null && {
								$address: {
									[EntityMetaKey.Selector]: {
										$network: $transaction.$network,
										address: output.scriptpubkey_address,
									},
								},
							}),
							...(runestone != null && runestone.location.outputIndex === indexInTransaction && {
								$bitcoinRunestone: {
									[EntityMetaKey.Selector]: {
										$transaction,
										outputIndex: indexInTransaction,
									},
								},
							}),
						}
					},
				}
			},
		})({
				valueSats: (output) => output.valueSats,
				scriptPubKeyAsm: (output) => output.scriptPubKeyAsm,
				scriptPubKeyHex: (output) => output.scriptPubKeyHex,
				scriptPubKeyType: (output) => output.scriptPubKeyType,
				$address: (output) => output.$address,
				$bitcoinRunestone: (output) => output.$bitcoinRunestone,
			}),

		defineResolver({
			entityType: EntityType.BitcoinOrdinalInscription,
			resolve: {
				NetworkInscriptionId: {
					appliesTo: bitcoinNetworkReferenceApplicability,
					resolve: async ({ $network, inscriptionId }) => {
						assertBitcoinMainnet($network)
						const parsed = parseBitcoinInscriptionId(inscriptionId)
						if (parsed == null)
							throw new Error(`MempoolSpace_Rest: invalid inscription id ${inscriptionId}`)

						const { getTransactionProtocolPayloads } = await import('$/sources/MempoolSpace/Rest/queries.ts')
						const payloads = ordinalsPayloads(
							await getTransactionProtocolPayloads(parsed.txId)
						)
						const payload = payloads.at(parsed.inscriptionIndex)
						if (payload == null)
							throw new Error(`MempoolSpace_Rest: inscription ${inscriptionId} not found in reveal transaction`)

						return bitcoinOrdinalInscriptionSnapshotFromPayload(
							$network,
							inscriptionId,
							parsed.inscriptionIndex,
							payload
						)
					},
				},
			},
		})({
			inscriptionIndex: (snapshot) => snapshot.inscriptionIndex,
			$revealTransaction: (snapshot) => snapshot.$revealTransaction,
			revealInputIndex: (snapshot) => snapshot.revealInputIndex,
			revealWitnessIndex: (snapshot) => snapshot.revealWitnessIndex,
			contentType: (snapshot) => snapshot.contentType,
			bodyHex: (snapshot) => snapshot.bodyHex,
			payloadHex: (snapshot) => snapshot.payloadHex,
		}),

		defineResolver({
			entityType: EntityType.BitcoinRunestone,
			resolve: {
				TransactionOutputIndex: {
					appliesTo: bitcoinTransactionReferenceApplicability,
					resolve: async ({ $transaction, outputIndex }) => {
						assertBitcoinMainnet($transaction.$network)
						const { getTransactionProtocolPayloads } = await import('$/sources/MempoolSpace/Rest/queries.ts')
						const runestone = runestonePayload(
							await getTransactionProtocolPayloads($transaction.txId)
						)
						if (runestone == null || runestone.location.outputIndex !== outputIndex)
							throw new Error(`MempoolSpace_Rest: runestone not found at output ${outputIndex}`)

						return bitcoinRunestoneSnapshotFromPayload($transaction, runestone)
					},
				},
			},
		})({
			$output: (snapshot) => snapshot.$output,
			payloadHex: (snapshot) => snapshot.payloadHex,
			isCenotaph: (snapshot) => snapshot.isCenotaph,
		}),

		defineResolver({
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: bitcoinNetworkTimestampApplicability,
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						if (source !== Source.MempoolSpace_Rest)
							throw new Error(`MempoolSpace_Rest: unsupported network timestamp source ${source}`)

						assertBitcoinMainnet($network)
						const {
							getBlocks,
							getMempoolStats,
							getRecommendedFees,
						} = await import('$/sources/MempoolSpace/Rest/queries.ts')
						const [blocks, mempoolStats, fees] = await Promise.all([
							getBlocks(),
							getMempoolStats(),
							getRecommendedFees(),
						])
						const block = blocks.at(0)
						if (block == null) throw new Error('MempoolSpace_Rest: no blocks returned')
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							ledgerModels: [NetworkLedgerModel.Utxo],
							executionModels: [] satisfies NetworkExecutionModel[],
							bestBlockHeight: BigInt(block.height),
							bestBlockHash: block.id,
							bestBlockTimeMs: block.timestamp * 1000,
							mempoolTransactionCount: mempoolStats.count,
							mempoolSizeBytes: BigInt(Math.ceil(mempoolStats.vsize)),
							suggestedTransactionFeePerByteSats: fees.hourFee,
						}
					},
				}
			},
		})({
				$network: (timestamp) => timestamp.$network,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				ledgerModels: (timestamp) => timestamp.ledgerModels,
				executionModels: (timestamp) => timestamp.executionModels,
				Utxo: {
					bestBlockHeight: (timestamp) => timestamp.bestBlockHeight,
					bestBlockHash: (timestamp) => timestamp.bestBlockHash,
					bestBlockTimeMs: (timestamp) => timestamp.bestBlockTimeMs,
					mempoolTransactionCount: (timestamp) => timestamp.mempoolTransactionCount,
					mempoolSizeBytes: (timestamp) => timestamp.mempoolSizeBytes,
					suggestedTransactionFeePerByteSats: (timestamp) => timestamp.suggestedTransactionFeePerByteSats,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: bitcoinNetworkSelectors(async (network) => {
				assertBitcoinMainnet(network)
				return {
					[EntityMetaKey.Selector]: network,
					slug: 'bitcoin',
				}
			}),
		})({
				slug: (network) => network.slug,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: bitcoinNetworkSelectors(async (network) => {
				assertBitcoinMainnet(network)
				const {
					getBlocks,
					getMempoolStats,
					getRecommendedFees,
				} = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const [blocks, mempoolStats, fees] = await Promise.all([
					getBlocks(),
					getMempoolStats(),
					getRecommendedFees(),
				])
				const block = blocks.at(0)
				if (block == null) throw new Error('MempoolSpace_Rest: no blocks returned')
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: network,
							timestampMs: Date.now(),
							source: Source.MempoolSpace_Rest,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: BigInt(block.height),
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: block.id,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: block.timestamp * 1000,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: mempoolStats.count,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: BigInt(Math.ceil(mempoolStats.vsize)),
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'suggestedTransactionFeePerByteSats')]: fees.hourFee,
						},
					},
				]
			}),
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: bitcoinNetworkSelectors(async (network, context) => {
				assertBitcoinMainnet(network)
				const { getBlocks } = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const tipBlocks = await getBlocks()
				const offset = context.pagination.offset ?? 0
				const tip = tipBlocks.at(0)
				if (tip == null)
					throw new Error('MempoolSpace_Rest: no blocks returned')

				if (BigInt(offset) > BigInt(tip.height))
					return []

				const blocks = (
					offset === 0 ?
						tipBlocks
					:
						await getBlocks(BigInt(tip.height) - BigInt(offset))
				)
				return blocks
					.slice(0, resolverContextRowLimit(context))
					.map((block) => utxoBlockReferenceFromMempoolSpaceWire(network, block))
			}),
		})({
				Utxo: {
					$$blocks: (blocks) => blocks,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: bitcoinNetworkSelectors(async (network) => {
				assertBitcoinMainnet(network)
				const {
					getBlocks,
					getMempoolStats,
				} = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const [blocks, mempoolStats] = await Promise.all([
					getBlocks(),
					getMempoolStats(),
				])
				const latestBlock = blocks.at(0)
				if (latestBlock == null)
					throw new Error('MempoolSpace_Rest: no blocks returned for counts')

				return {
					blocks: latestBlock.height + 1,
					transactions: mempoolStats.count,
				}
			}),
		})({
				Utxo: {
					$$blocks: {
						resolveCount: (counts) => counts.blocks,
					},
					$$transactions: {
						resolveCount: (counts) => counts.transactions,
					},
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: bitcoinNetworkSelectors(async (network, context) => {
				assertBitcoinMainnet(network)
				const { getMempoolTxids } = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const txids = await getMempoolTxids()
				return txids.slice(0, resolverContextRowLimit(context)).map((txId) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						txId,
					},
				}))
			}),
		})({
				Utxo: {
					$$transactions: (transactions) => transactions,
				},
			}),

		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeightHash: {
					appliesTo: bitcoinNetworkReferenceApplicability,
					resolve: async ({ $network, hash }) => {
						assertBitcoinMainnet($network)
						const { getBlockTransactionIds } = await import('$/sources/MempoolSpace/Rest/queries.ts')
						return (
							await getBlockTransactionIds(hash)
						).map((txId) => ({
							[EntityMetaKey.Selector]: {
								$network,
								txId,
							},
						}))
					},
				}
			},
		})({
				$$transactions: (transactions) => transactions,
			}),

	],
} satisfies RegisteredSourceResolverModule
