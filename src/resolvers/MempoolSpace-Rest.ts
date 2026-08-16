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
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$outputs')]: transaction.vout.map((output, indexInTransaction) => ({
				[EntityMetaKey.Selector]: {
					$transaction,
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

const bitcoinMainnetCaip2 = 'bip122:000000000019d6689c085ae165831e93' as const

const bitcoinNetworkApplicability = [
	{
		caip2: networkBySlug.bitcoin.caip2,
	},
	{
		slug: 'bitcoin',
	},
] as const

const bitcoinTestnetNetworkApplicability = [
	{
		caip2: networkBySlug['bitcoin-testnet'].caip2,
	},
	{
		slug: 'bitcoin-testnet',
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

const bitcoinHierarchyNetworkReferenceApplicability = [
	...bitcoinNetworkReferenceApplicability,
	{
		$network: bitcoinTestnetNetworkApplicability[0],
	},
	{
		$network: bitcoinTestnetNetworkApplicability[1],
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

const bitcoinMainnetTransactionReferenceApplicability = [
	{
		$transaction: bitcoinNetworkReferenceApplicability[0],
	},
	{
		$transaction: bitcoinNetworkReferenceApplicability[1],
	},
] as const

const bitcoinHierarchyTransactionReferenceApplicability = [
	{
		$transaction: bitcoinHierarchyNetworkReferenceApplicability[0],
	},
	{
		$transaction: bitcoinHierarchyNetworkReferenceApplicability[1],
	},
	{
		$transaction: bitcoinHierarchyNetworkReferenceApplicability[2],
	},
	{
		$transaction: bitcoinHierarchyNetworkReferenceApplicability[3],
	},
] as const

const mempoolSpaceTargetForNetwork = (network: NetworkId) => {
	const target = (
		'caip2' in network
		&& network.caip2.namespace === 'bip122'
		&& network.caip2.reference === '000000000019d6689c085ae165831e93' ?
			bitcoinMainnetCaip2
		: 'caip2' in network
		&& network.caip2.namespace === 'bip122'
		&& network.caip2.reference === '000000000933ea01ad0ee984209779ba' ?
			'bip122:000000000933ea01ad0ee984209779ba'
		: 'slug' in network && network.slug === 'bitcoin' ?
			bitcoinMainnetCaip2
		: 'slug' in network && network.slug === 'bitcoin-testnet' ?
			'bip122:000000000933ea01ad0ee984209779ba'
		:
			undefined
	)
	if (target == null)
		throw new Error('MempoolSpace_Rest: unsupported Bitcoin network')

	return target
}

const assertBitcoinMainnet = (network: NetworkId) => {
	if (mempoolSpaceTargetForNetwork(network) !== bitcoinMainnetCaip2)
		throw new Error('MempoolSpace_Rest: unsupported Bitcoin network')
}

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
	const { getTransaction } = await import('$/sources/MempoolSpace/Rest/queries.ts')
	return getTransaction(txId, mempoolSpaceTargetForNetwork($network))
}

const utxoBlockSnapshot = async (
	$network: NetworkId,
	hash: string
) => {
	const {
		getBlock,
	} = await import('$/sources/MempoolSpace/Rest/queries.ts')
	const block = await getBlock({
		blockHash: hash,
		target: mempoolSpaceTargetForNetwork($network),
	})
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

const utxoBlockTransactionPage = async (
	$network: NetworkId,
	hash: string,
	offset: number,
	limit: number
) => {
	const target = mempoolSpaceTargetForNetwork($network)
	const {
		getBlock,
		getBlockTransactions,
	} = await import('$/sources/MempoolSpace/Rest/queries.ts')
	const block = await getBlock({
		blockHash: hash,
		target,
	})
	const transactionCount = block.tx_count
	const transactions: MempoolSpaceTransaction[] = []
	while (
		transactions.length < limit
		&& offset + transactions.length < transactionCount
	) {
		const page = await getBlockTransactions({
			blockHash: hash,
			startIndex: offset + transactions.length,
			target,
		})
		if (page.length === 0)
			throw new Error('MempoolSpace_Rest: block transaction page ended before authoritative total')

		transactions.push(...page.slice(
			0,
			Math.min(
				limit - transactions.length,
				transactionCount - offset - transactions.length
			)
		))
	}
	return {
		$network,
		hash,
		height: BigInt(block.height),
		transactions: transactions.map((transaction) => utxoTransactionReferenceFromMempoolSpaceWire(
			$network,
			transaction
		)),
		transactionCount,
	}
}

export default {
	source: Source.MempoolSpace_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: bitcoinHierarchyNetworkReferenceApplicability,
					resolve: async ({ $network, height }) => {
						const {
							getBlockHashByHeight,
						} = await import('$/sources/MempoolSpace/Rest/queries.ts')
						return utxoBlockSnapshot(
							$network,
							await getBlockHashByHeight({
								height,
								target: mempoolSpaceTargetForNetwork($network),
							})
						)
					},
				},
				NetworkHeightHash: {
					appliesTo: bitcoinHierarchyNetworkReferenceApplicability,
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
					appliesTo: bitcoinHierarchyNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						const transaction = await getTransaction(entitySelector)
						const target = mempoolSpaceTargetForNetwork(entitySelector.$network)
						const payloads = (
							target === bitcoinMainnetCaip2 ?
								(
									await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
								).extractEsploraProtocolPayloads(transaction)
							:
								[]
						)
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
					appliesTo: bitcoinHierarchyTransactionReferenceApplicability,
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
						const { getAddress } = await import('$/sources/MempoolSpace/Rest/queries.ts')
						const address = await getAddress({
							address: addressSelector,
							target: mempoolSpaceTargetForNetwork($network),
						})
						const chainStats = address.chain_stats
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
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'balanceSats')]: BigInt(chainStats.funded_txo_sum - chainStats.spent_txo_sum),
										[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'transactionCount')]: chainStats.tx_count,
										[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'unspentOutputCount')]: chainStats.funded_txo_count - chainStats.spent_txo_count,
										[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'fundedOutputCount')]: chainStats.funded_txo_count,
										[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'spentOutputCount')]: chainStats.spent_txo_count,
										[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'fundedValueSats')]: BigInt(chainStats.funded_txo_sum),
										[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'spentValueSats')]: BigInt(chainStats.spent_txo_sum),
										[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'mempoolTransactionCount')]: address.mempool_stats.tx_count,
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
						const transactions = await getAddressTransactions({
							address: utxoAddress.address,
							lastSeenTransactionId: context.providerContinuationToken,
							target: mempoolSpaceTargetForNetwork(utxoAddress.$network),
						})

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
							await getAddressUtxos({
								address,
								target: mempoolSpaceTargetForNetwork($network),
							})
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
			entityType: EntityType.UtxoOutput,
			resolve: {
				TransactionIndexInTransaction: {
					appliesTo: bitcoinHierarchyTransactionReferenceApplicability,
					resolve: async ({ $transaction, indexInTransaction }) => {
						const transaction = await getTransaction($transaction)
						const output = transaction.vout.at(indexInTransaction)
						if (output == null)
							throw new Error(`MempoolSpace_Rest: transaction output ${indexInTransaction} not found`)

						const runestone = (
							mempoolSpaceTargetForNetwork($transaction.$network) === bitcoinMainnetCaip2 ?
								runestonePayload(
									(
										await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
									).extractEsploraProtocolPayloads(transaction)
								)
							:
								null
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
			entityType: EntityType.UtxoOutput,
			resolve: {
				TransactionIndexInTransaction: {
					appliesTo: bitcoinHierarchyTransactionReferenceApplicability,
					resolve: async ({ $transaction, indexInTransaction }) => {
						const { getOutspend } = await import('$/sources/MempoolSpace/Rest/queries.ts')
						return {
							isSpent: (
								await getOutspend({
									txId: $transaction.txId,
									vout: indexInTransaction,
									target: mempoolSpaceTargetForNetwork($transaction.$network),
								})
							).spent,
						}
					},
				},
			},
		})({
			isSpent: (snapshot) => snapshot.isSpent,
		}),

		defineResolver({
			entityType: EntityType.BitcoinOrdinalInscription,
			resolve: {
				NetworkInscriptionId: {
					appliesTo: bitcoinNetworkReferenceApplicability,
					resolve: async ({ $network, inscriptionId }) => {
						if (mempoolSpaceTargetForNetwork($network) !== bitcoinMainnetCaip2)
							throw new Error('MempoolSpace_Rest: Ordinals only on Bitcoin mainnet')

						const parsed = parseBitcoinInscriptionId(inscriptionId)
						if (parsed == null)
							throw new Error(`MempoolSpace_Rest: invalid inscription id ${inscriptionId}`)

						const { getTransactionProtocolPayloads } = await import('$/sources/MempoolSpace/Rest/queries.ts')
						const payloads = ordinalsPayloads(
							await getTransactionProtocolPayloads({
								txId: parsed.txId,
								target: bitcoinMainnetCaip2,
							})
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
					appliesTo: bitcoinMainnetTransactionReferenceApplicability,
					resolve: async ({ $transaction, outputIndex }) => {
						if (mempoolSpaceTargetForNetwork($transaction.$network) !== bitcoinMainnetCaip2)
							throw new Error('MempoolSpace_Rest: Runes only on Bitcoin mainnet')

						const { getTransactionProtocolPayloads } = await import('$/sources/MempoolSpace/Rest/queries.ts')
						const runestone = runestonePayload(
							await getTransactionProtocolPayloads({
								txId: $transaction.txId,
								target: bitcoinMainnetCaip2,
							})
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
						const { getMiningHashrate } = await import('$/sources/MempoolSpace/Rest/queries.ts')
						const miningHashrate = await getMiningHashrate({
							target: bitcoinMainnetCaip2,
						})
						const historicalHashrate = miningHashrate.hashrates.find((hashrate) => hashrate.timestamp * 1_000 === timestampMs)
						if (historicalHashrate == null)
							throw new Error(`MempoolSpace_Rest: no mining hashrate observation at ${String(timestampMs)}`)

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							ledgerModels: [NetworkLedgerModel.Utxo],
							executionModels: [] satisfies NetworkExecutionModel[],
							hashrateHashesPerSecond: historicalHashrate.avgHashrate,
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
					hashrateHashesPerSecond: (timestamp) => timestamp.hashrateHashesPerSecond,
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
			resolve: bitcoinNetworkSelectors(async (network, context) => {
				assertBitcoinMainnet(network)
				const {
					getBlocks,
					getMempoolStats,
					getMiningHashrate,
					getRecommendedFees,
					getDifficultyAdjustment,
				} = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const [blocks, mempoolStats, miningHashrate, fees, difficultyAdjustment] = await Promise.all([
					getBlocks({
						target: bitcoinMainnetCaip2,
					}),
					getMempoolStats({
						target: bitcoinMainnetCaip2,
					}),
					getMiningHashrate({
						target: bitcoinMainnetCaip2,
					}),
					getRecommendedFees({
						target: bitcoinMainnetCaip2,
					}),
					getDifficultyAdjustment({
						target: bitcoinMainnetCaip2,
					}),
				])
				const block = blocks.at(0)
				if (block == null) throw new Error('MempoolSpace_Rest: no blocks returned')
				const timestampMs = Date.now()
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: network,
							timestampMs,
							source: Source.MempoolSpace_Rest,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'ledgerModels')]: [NetworkLedgerModel.Utxo],
							[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'executionModels')]: [],
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: BigInt(block.height),
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: block.id,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: block.timestamp * 1000,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: mempoolStats.count,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: BigInt(Math.ceil(mempoolStats.vsize)),
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'hashrateHashesPerSecond')]: miningHashrate.currentHashrate,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'suggestedTransactionFeePerByteSats')]: fees.hourFee,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'difficultyAdjustmentProgressPercent')]: difficultyAdjustment.progressPercent,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'difficultyChangePercent')]: difficultyAdjustment.difficultyChange,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'previousRetargetPercent')]: difficultyAdjustment.previousRetarget,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'remainingBlocks')]: difficultyAdjustment.remainingBlocks,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'expectedBlocks')]: difficultyAdjustment.expectedBlocks,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'nextRetargetHeight')]: difficultyAdjustment.nextRetargetHeight,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'estimatedRetargetDateMs')]: difficultyAdjustment.estimatedRetargetDate,
						},
					},
					...[...miningHashrate.hashrates]
						.sort((left, right) => right.timestamp - left.timestamp)
						.filter(({ timestamp }) => timestamp * 1_000 !== timestampMs)
						.slice(0, Math.max(0, resolverContextRowLimit(context) - 1))
						.map(({ timestamp, avgHashrate }) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: timestamp * 1_000,
								source: Source.MempoolSpace_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'ledgerModels')]: [NetworkLedgerModel.Utxo],
								[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'executionModels')]: [],
								[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'hashrateHashesPerSecond')]: avgHashrate,
							},
						})),
				]
			}),
			resolveLive: {
				networkHead: {
					facetPath: [],
					publishes: {
						'$$timestamps': true,
					},
					start: ({
						fields,
						parentEntitySelector,
						signal,
					}) => {
						assertBitcoinMainnet(parentEntitySelector)
						let timeout: ReturnType<typeof setTimeout> | undefined
						const poll = async () => {
							try {
								if (signal.aborted)
									return
								const {
									getTipHeight,
									getMempoolStats,
									getRecommendedFees,
								} = await import('$/sources/MempoolSpace/Rest/queries.ts')
								const [tipHeight, mempoolStats, fees] = await Promise.all([
									getTipHeight({
										target: bitcoinMainnetCaip2,
									}),
									getMempoolStats({
										target: bitcoinMainnetCaip2,
									}),
									getRecommendedFees({
										target: bitcoinMainnetCaip2,
									}),
								])
								fields.$$timestamps.replaceRows([{
									source: Source.MempoolSpace_Rest,
									value: [{
										[EntityMetaKey.Selector]: {
											$network: parentEntitySelector,
											timestampMs: Date.now(),
											source: Source.MempoolSpace_Rest,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'ledgerModels')]: [NetworkLedgerModel.Utxo],
											[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'executionModels')]: [],
											[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: BigInt(tipHeight),
											[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: mempoolStats.count,
											[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: BigInt(Math.ceil(mempoolStats.vsize)),
											[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'suggestedTransactionFeePerByteSats')]: fees.hourFee,
										},
									}],
								}])
							} catch (error) {
								console.error('MempoolSpace_Rest live network head failed', error)
							}
							if (signal.aborted)
								return
							timeout = setTimeout(() => { void poll() }, 15_000)
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
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: bitcoinNetworkSelectors(async (network, context) => {
				assertBitcoinMainnet(network)
				const { getBlocks } = await import('$/sources/MempoolSpace/Rest/queries.ts')
				const tipBlocks = await getBlocks({
					target: bitcoinMainnetCaip2,
				})
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
						await getBlocks({
							target: bitcoinMainnetCaip2,
							startHeight: BigInt(tip.height) - BigInt(offset),
						})
				)
				return blocks
					.slice(0, resolverContextRowLimit(context))
					.map((block) => utxoBlockReferenceFromMempoolSpaceWire(network, block))
			}),
			resolveLive: {
				utxoHead: {
					facetPath: ['Utxo'],
					publishes: {
						'$$blocks': true,
					},
					start: ({
						fields,
						parentEntitySelector,
						signal,
					}) => {
						assertBitcoinMainnet(parentEntitySelector)
						let timeout: ReturnType<typeof setTimeout> | undefined
						let lastHeight: number | undefined
						const poll = async () => {
							try {
								if (signal.aborted)
									return
								const { getTipHeight } = await import('$/sources/MempoolSpace/Rest/queries.ts')
								const tipHeight = await getTipHeight({
									target: bitcoinMainnetCaip2,
								})
								if (lastHeight !== tipHeight) {
									lastHeight = tipHeight
									fields.$$blocks.invalidate()
								}
							} catch (error) {
								console.error('MempoolSpace_Rest live UTXO head failed', error)
							}
							if (signal.aborted)
								return
							timeout = setTimeout(() => { void poll() }, 15_000)
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
					getBlocks({
						target: bitcoinMainnetCaip2,
					}),
					getMempoolStats({
						target: bitcoinMainnetCaip2,
					}),
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
				const txids = await getMempoolTxids({
					target: bitcoinMainnetCaip2,
				})
				return Promise.all(
					txids
						.slice(
							context.pagination.offset ?? 0,
							(context.pagination.offset ?? 0) + resolverContextRowLimit(context)
						)
						.map(async (txId) => utxoTransactionReferenceFromMempoolSpaceWire(
							network,
							await getTransaction({
								$network: network,
								txId,
							})
						))
				)
			}),
		})({
				Utxo: {
					$$transactions: (transactions) => transactions,
				},
			}),

		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: bitcoinHierarchyNetworkReferenceApplicability,
					resolve: async ({ $network, height }, context) => (
						utxoBlockTransactionPage(
							$network,
							await (
								await import('$/sources/MempoolSpace/Rest/queries.ts')
							).getBlockHashByHeight({
								height,
								target: mempoolSpaceTargetForNetwork($network),
							}),
							context.pagination.offset ?? 0,
							resolverContextRowLimit(context)
						)
					),
				},
				NetworkHeightHash: {
					appliesTo: bitcoinHierarchyNetworkReferenceApplicability,
					resolve: ({ $network, hash }, context) => (
						utxoBlockTransactionPage(
							$network,
							hash,
							context.pagination.offset ?? 0,
							resolverContextRowLimit(context)
						)
					),
				}
			},
		})({
				$$transactions: {
					select: (page) => page.transactions,
					resolveCount: (page) => page.transactionCount,
				},
			}),

	],
} satisfies RegisteredSourceResolverModule
