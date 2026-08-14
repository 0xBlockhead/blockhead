import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	networkBySlug,
	NetworkExecutionModel,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertBitcoinCashMainnet = (network: NetworkId) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== networkBySlug['bitcoin-cash'].caip2.namespace
				|| network.caip2.reference !== networkBySlug['bitcoin-cash'].caip2.reference
			)
		:
			network.slug !== networkBySlug['bitcoin-cash'].slug
	)
		throw new Error('BitcoinCashNode_JsonRpc: unsupported network')
}

const getTransaction = async ({ $network, txId }: {
	$network: NetworkId
	txId: string
}) => {
	assertBitcoinCashMainnet($network)
	const { getRawTransaction } = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
	return getRawTransaction({
		txId,
	})
}

const getOutput = async ({ $transaction, indexInTransaction }: {
	$transaction: {
		$network: NetworkId
		txId: string
	}
	indexInTransaction: number
}) => {
	const output = (await getTransaction($transaction)).vout.at(indexInTransaction)
	if (output == null)
		throw new Error(`BitcoinCashNode_JsonRpc: output not found for ${$transaction.txId}:${String(indexInTransaction)}`)
	return output
}

const utxoBlockSnapshot = async (
	$network: NetworkId,
	blockHash: string
) => {
	const { getBlock } = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
	const block = await getBlock({
		blockHash,
	})
	if (typeof block === 'string')
		throw new Error('BitcoinCashNode_JsonRpc: expected verbose block')
	return {
		hash: block.hash,
		...(block.previousblockhash != null && {
			$parent: {
				[EntityMetaKey.Selector]: {
					$network,
					height: BigInt(block.height - 1),
					hash: block.previousblockhash,
				},
			},
		}),
		timestampMs: block.time * 1000,
		merkleRoot: block.merkleroot,
		nonce: block.nonce,
		difficulty: block.difficulty,
		...(block.size != null && {
			sizeBytes: block.size,
		}),
		...(block.weight != null && {
			weightUnits: block.weight,
		}),
		transactionCount: block.nTx,
		$$transactions: block.tx.map((transaction) => (
			typeof transaction === 'string' ?
				{
					[EntityMetaKey.Selector]: {
						$network,
						txId: transaction,
					},
				}
			:
				{
					[EntityMetaKey.Selector]: {
						$network,
						txId: transaction.txid,
					},
				}
		)),
	}
}

const resolveUtxoBlocks = async (
	network: NetworkId,
	context: Parameters<typeof resolverContextRowLimit>[0]
) => {
	assertBitcoinCashMainnet(network)
	const {
		getBlockCount,
		getBlockHash,
	} = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
	const tipHeight = await getBlockCount()
	const limit = resolverContextRowLimit(context)
	const heights = Array.from(
		{ length: Math.min(limit, tipHeight + 1) },
		(_, index) => tipHeight - index
	).filter((height) => height >= 0)
	return {
		tipHeight,
		blocks: await Promise.all(
			heights.map(async (height) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					height: BigInt(height),
					hash: await getBlockHash({
						height: BigInt(height),
					}),
				},
			}))
		),
	}
}

const resolveNetworkTipObservation = async (network: NetworkId) => {
	assertBitcoinCashMainnet(network)
	const {
		getBlock,
		getBlockCount,
		getBlockHash,
		getMempoolInfo,
	} = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
	const tipHeight = await getBlockCount()
	const [bestBlockHash, mempoolInfo] = await Promise.all([
		getBlockHash({
			height: BigInt(tipHeight),
		}),
		getMempoolInfo(),
	])
	const tipBlock = await getBlock({
		blockHash: bestBlockHash,
	})
	if (typeof tipBlock === 'string')
		throw new Error('BitcoinCashNode_JsonRpc: expected verbose tip block')
	return {
		bestBlockHeight: BigInt(tipHeight),
		bestBlockHash,
		bestBlockTimeMs: tipBlock.time * 1000,
		blockCount: BigInt(tipHeight + 1),
		mempoolTransactionCount: mempoolInfo.size,
		mempoolSizeBytes: BigInt(mempoolInfo.bytes),
	}
}

const resolveNetworkTipTimestamps = async (network: NetworkId) => {
	const tip = await resolveNetworkTipObservation(network)
	return [
		{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: Date.now(),
				source: Source.BitcoinCashNode_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: tip.bestBlockHeight,
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: tip.bestBlockHash,
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: tip.bestBlockTimeMs,
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: tip.blockCount,
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: tip.mempoolTransactionCount,
				[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: tip.mempoolSizeBytes,
			},
		},
	]
}

export default {
	source: Source.BitcoinCashNode_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }) => {
						assertBitcoinCashMainnet($network)
						const { getBlockHash } = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
						return utxoBlockSnapshot(
							$network,
							await getBlockHash({
								height,
							})
						)
					},
				},
				NetworkHeightHash: {
					resolve: async ({ $network, hash }) => {
						assertBitcoinCashMainnet($network)
						return utxoBlockSnapshot($network, hash)
					},
				},
			},
		})({
			hash: (snapshot) => snapshot.hash,
			$parent: (snapshot) => snapshot.$parent,
			timestampMs: (snapshot) => snapshot.timestampMs,
			merkleRoot: (snapshot) => snapshot.merkleRoot,
			nonce: (snapshot) => snapshot.nonce,
			difficulty: (snapshot) => snapshot.difficulty,
			sizeBytes: (snapshot) => snapshot.sizeBytes,
			weightUnits: (snapshot) => snapshot.weightUnits,
			transactionCount: (snapshot) => snapshot.transactionCount,
			$$transactions: (snapshot) => snapshot.$$transactions,
		}),

		defineResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: {
				NetworkTxId: {
					resolve: async (entitySelector) => {
						const transaction = await getTransaction(entitySelector)
						return {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								txId: transaction.txid,
							},
							version: transaction.version,
							lockTime: transaction.locktime,
							sizeBytes: transaction.size,
							virtualSizeBytes: transaction.vsize,
							weightUnits: transaction.weight,
							isCoinbase: transaction.vin.some((input) => input.coinbase != null),
							$$inputs: transaction.vin.map((_input, indexInTransaction) => (
								{
									[EntityMetaKey.Selector]: {
										$transaction: entitySelector,
										indexInTransaction,
									},
								}
							)),
							$$outputs: transaction.vout.map((_output, indexInTransaction) => (
								{
									[EntityMetaKey.Selector]: {
										$transaction: entitySelector,
										indexInTransaction,
									},
								}
							)),
						}
					},
				},
			},
		})({
			version: (snapshot) => snapshot.version,
			lockTime: (snapshot) => snapshot.lockTime,
			sizeBytes: (snapshot) => snapshot.sizeBytes,
			virtualSizeBytes: (snapshot) => snapshot.virtualSizeBytes,
			weightUnits: (snapshot) => snapshot.weightUnits,
			isCoinbase: (snapshot) => snapshot.isCoinbase,
			$$inputs: (snapshot) => snapshot.$$inputs,
			$$outputs: (snapshot) => snapshot.$$outputs,
		}),

		defineResolver({
			entityType: EntityType.UtxoInput,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }) => {
						const input = (await getTransaction($transaction)).vin[indexInTransaction]
						return {
							[EntityMetaKey.Selector]: {
								$transaction,
								indexInTransaction,
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
							...(input.coinbase != null && {
								coinbaseScript: input.coinbase,
							}),
							...(input.scriptSig != null && {
								scriptSigAsm: input.scriptSig.asm,
							}),
							sequence: input.sequence,
							...(input.txinwitness != null && {
								witness: input.txinwitness,
							}),
						}
					},
				},
			},
		})({
			$spentOutput: (snapshot) => snapshot.$spentOutput,
			coinbaseScript: (snapshot) => snapshot.coinbaseScript,
			scriptSigAsm: (snapshot) => snapshot.scriptSigAsm,
			sequence: (snapshot) => snapshot.sequence,
			witness: (snapshot) => snapshot.witness ?? [],
		}),

		defineResolver({
			entityType: EntityType.UtxoOutput,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector) => {
						const output = await getOutput(entitySelector)
						return {
							[EntityMetaKey.Selector]: {
								$transaction: entitySelector.$transaction,
								indexInTransaction: entitySelector.indexInTransaction,
							},
							valueSats: BigInt(Math.round(output.value * 100_000_000)),
							scriptPubKeyAsm: output.scriptPubKey.asm,
							scriptPubKeyHex: output.scriptPubKey.hex,
							scriptPubKeyType: output.scriptPubKey.type,
							...(output.scriptPubKey.address != null && {
								$address: {
									[EntityMetaKey.Selector]: {
										$network: entitySelector.$transaction.$network,
										address: output.scriptPubKey.address,
									},
								},
							}),
							...(output.tokenData?.amount != null && {
								$bitcoinCashCashTokenFungibleAmount: {
									[EntityMetaKey.Selector]: {
										$output: entitySelector,
									},
								},
							}),
							...(output.tokenData?.nft != null && {
								$bitcoinCashCashTokenNft: {
									[EntityMetaKey.Selector]: {
										$output: entitySelector,
									},
								},
							}),
						}
					},
				},
			},
		})({
			valueSats: (snapshot) => snapshot.valueSats,
			scriptPubKeyAsm: (snapshot) => snapshot.scriptPubKeyAsm,
			scriptPubKeyHex: (snapshot) => snapshot.scriptPubKeyHex,
			scriptPubKeyType: (snapshot) => snapshot.scriptPubKeyType,
			$address: (snapshot) => snapshot.$address,
			$bitcoinCashCashTokenFungibleAmount: (snapshot) => snapshot.$bitcoinCashCashTokenFungibleAmount,
			$bitcoinCashCashTokenNft: (snapshot) => snapshot.$bitcoinCashCashTokenNft,
		}),

		defineResolver({
			entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
			resolve: {
				UtxoOutput: {
					resolve: async ({ $output }) => {
						const output = await getOutput($output)
						if (output.tokenData?.amount == null)
							throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken fungible amount')
						return {
							$category: {
								[EntityMetaKey.Selector]: {
									$network: $output.$transaction.$network,
									categoryId: output.tokenData.category,
								},
							},
							amount: BigInt(output.tokenData.amount),
						}
					},
				},
			},
		})({
			$category: (snapshot) => snapshot.$category,
			amount: (snapshot) => snapshot.amount,
		}),

		defineResolver({
			entityType: EntityType.BitcoinCashCashTokenNft,
			resolve: {
				UtxoOutput: {
					resolve: async ({ $output }) => {
						const output = await getOutput($output)
						if (output.tokenData?.nft == null)
							throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken NFT')
						return {
							$category: {
								[EntityMetaKey.Selector]: {
									$network: $output.$transaction.$network,
									categoryId: output.tokenData.category,
								},
							},
							$commitment: {
								[EntityMetaKey.Selector]: {
									$output: $output,
								},
							},
							capability: output.tokenData.nft.capability,
						}
					},
				},
			},
		})({
			$category: (snapshot) => snapshot.$category,
			$commitment: (snapshot) => snapshot.$commitment,
			capability: (snapshot) => snapshot.capability,
		}),

		defineResolver({
			entityType: EntityType.BitcoinCashCashTokenCommitment,
			resolve: {
				UtxoOutput: {
					resolve: async ({ $output }) => {
						const output = await getOutput($output)
						if (output.tokenData?.nft == null)
							throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken NFT commitment')
						return {
							commitmentHex: output.tokenData.nft.commitment,
						}
					},
				},
			},
		})({
			commitmentHex: (snapshot) => snapshot.commitmentHex,
		}),

		defineResolver({
			entityType: EntityType.UtxoAddress,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						assertBitcoinCashMainnet($network)
						const { getTransparentAddressUtxos } = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
						const { unspents } = await getTransparentAddressUtxos({
							address,
							maxResults: resolverContextRowLimit(context),
						})
						return unspents.map((utxo) => ({
							[EntityMetaKey.Selector]: {
								$transaction: {
									$network,
									txId: utxo.txid,
								},
								indexInTransaction: utxo.vout,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: utxo.valueZatoshis,
								[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: utxo.scriptPubKey,
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
			entityType: EntityType.UtxoAddress,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address: addressSelector }) => {
						assertBitcoinCashMainnet($network)
						const { getTransparentAddressUtxos } = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
						const scan = await getTransparentAddressUtxos({
							address: addressSelector,
							maxResults: 10_000,
						})
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
										source: Source.BitcoinCashNode_JsonRpc,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'balanceSats')]: scan.totalAmountZatoshis,
										[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'unspentOutputCount')]: scan.unspents.length,
									},
								},
							],
						}
					},
				},
			},
		})({
			address: (address) => address.address,
			$$timestamps: (address) => address.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: resolveUtxoBlocks,
				},
				Slug: {
					resolve: resolveUtxoBlocks,
				},
			},
		})({
			Utxo: {
				$$blocks: {
					select: (snapshot) => snapshot.blocks,
					resolveCount: (snapshot) => BigInt(snapshot.tipHeight + 1),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: resolveNetworkTipTimestamps,
				},
				Slug: {
					resolve: resolveNetworkTipTimestamps,
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: [
						{
							$network: {
								caip2: networkBySlug['bitcoin-cash'].caip2,
							},
							source: Source.BitcoinCashNode_JsonRpc,
						},
						{
							$network: {
								slug: networkBySlug['bitcoin-cash'].slug,
							},
							source: Source.BitcoinCashNode_JsonRpc,
						},
					],
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						if (source !== Source.BitcoinCashNode_JsonRpc)
							throw new Error(`BitcoinCashNode_JsonRpc: unsupported network timestamp source ${source}`)

						throw new Error(`BitcoinCashNode_JsonRpc: no network observation at ${String(timestampMs)}`)
					},
				},
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
				blockCount: (timestamp) => timestamp.blockCount,
				mempoolTransactionCount: (timestamp) => timestamp.mempoolTransactionCount,
				mempoolSizeBytes: (timestamp) => timestamp.mempoolSizeBytes,
			},
		}),
	],
}
