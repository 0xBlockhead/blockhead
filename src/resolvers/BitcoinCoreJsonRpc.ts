import {
	networkBySlug,
	NetworkExecutionModel,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import {
	bitcoinOrdinalInscriptionRefsFromPayloads,
	bitcoinOrdinalInscriptionSnapshotFromPayload,
	bitcoinRunestoneRefFromPayloads,
	bitcoinRunestoneSnapshotFromPayload,
	ordinalsPayloads,
	parseBitcoinInscriptionId,
	runestonePayload,
} from '$/resolvers/bitcoinOrdinalsRunes.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type BitcoinCoreQueries = typeof import('$/sources/BitcoinCore/JsonRpc/queries.ts')

export const bitcoinCoreJsonRpcResolvers = <
	_Source extends Source.BitcoinCore_JsonRpc
>({
	acceptsSlugSelector,
	loadMempoolTransactionIds,
	loadQueries,
	network,
	source,
}: {
	acceptsSlugSelector: boolean
	loadMempoolTransactionIds?: () => Promise<string[]>
	loadQueries: () => Promise<BitcoinCoreQueries>
	network: (typeof networkBySlug)['bitcoin']
	source: _Source
}) => {
	const assertNetwork = (
		networkSelector: NetworkId
	) => {
		if (
			'caip2' in networkSelector ?
				(
					networkSelector.caip2.namespace !== network.caip2.namespace
					|| networkSelector.caip2.reference !== network.caip2.reference
				)
			:
				!acceptsSlugSelector || networkSelector.slug !== network.slug
		)
			throw new Error(`${source}: unsupported ${network.name} network`)
	}

	const getTransaction = async ({ $network, txId }: {
		$network: NetworkId
		txId: string
	}) => {
		assertNetwork($network)
		const { getRawTransaction } = await loadQueries()
		return getRawTransaction({
			txId: txId,
		})
	}

	const getBitcoinProtocolPayloads = async ({ $network, txId }: {
		$network: NetworkId
		txId: string
	}) => {
		assertNetwork($network)
		const transaction = await getTransaction({
			$network,
			txId,
		})
		const { extractProtocolPayloads } = await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
		return extractProtocolPayloads(transaction)
	}

	const bitcoinProtocolPayloadsFromTransaction = async (
		transaction: Awaited<ReturnType<typeof getTransaction>>
	) => {
		const { extractProtocolPayloads } = await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
		return extractProtocolPayloads(transaction)
	}

	const utxoTransactionSnapshot = async (
		entitySelector: EntitySelector<typeof schema, EntityType.UtxoTransaction>,
		transaction: Awaited<ReturnType<typeof getTransaction>>
	) => {
		const payloads = await bitcoinProtocolPayloadsFromTransaction(transaction)
		const $bitcoinRunestone = bitcoinRunestoneRefFromPayloads(entitySelector, payloads)
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
			...(transaction.blockhash != null && {
				$block: {
					[EntityMetaKey.Selector]: {
						$network: entitySelector.$network,
						height: BigInt((await (await loadQueries()).getBlock({
							blockHash: transaction.blockhash,
						})).height),
						hash: transaction.blockhash,
					},
				},
			}),
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
					...(input.coinbase != null && {
						[entityFieldAddressKey(EntityType.UtxoInput, [], 'coinbaseScript')]: input.coinbase,
					}),
					...(input.scriptSig != null && {
						[entityFieldAddressKey(EntityType.UtxoInput, [], 'scriptSigAsm')]: input.scriptSig.asm,
					}),
					[entityFieldAddressKey(EntityType.UtxoInput, [], 'sequence')]: input.sequence,
					[entityFieldAddressKey(EntityType.UtxoInput, [], 'witness')]: input.txinwitness ?? [],
				},
			})),
			$$outputs: transaction.vout.map((output, indexInTransaction) => ({
				[EntityMetaKey.Selector]: {
					$transaction: entitySelector,
					indexInTransaction,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: BigInt(Math.round(output.value * 100_000_000)),
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyAsm')]: output.scriptPubKey.asm,
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: output.scriptPubKey.hex,
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyType')]: output.scriptPubKey.type,
					...(output.scriptPubKey.address != null && {
						[entityFieldAddressKey(EntityType.UtxoOutput, [], '$address')]: {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								address: output.scriptPubKey.address,
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
	}

	const utxoBlockSnapshot = async (
		$network: NetworkId,
		blockHash: string
	) => {
		const { getBlock } = await loadQueries()
		const block = await getBlock({
			blockHash,
		})
		if (block.hash !== blockHash)
			throw new Error(`${source}: block response does not match requested hash`)

		const transactionIds = block.tx.map((transaction) => (
			typeof transaction === 'string' ? transaction : transaction.txid
		))
		if (new Set(transactionIds).size !== transactionIds.length)
			throw new Error(`${source}: block response contains duplicate transaction identities`)

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
			$$transactions: transactionIds.map((txId) => ({
				[EntityMetaKey.Selector]: {
					$network,
					txId,
				},
			})),
		}
	}

	const resolveUtxoBlocks = async (
		networkSelector: NetworkId,
		context: Parameters<typeof resolverContextRowLimit>[0]
	) => {
		assertNetwork(networkSelector)
		const {
			getBlockCount,
			getBlockHash,
		} = await loadQueries()
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
						$network: networkSelector,
						height: BigInt(height),
						hash: await getBlockHash({
							height: BigInt(height),
						}),
					},
				}))
			),
		}
	}

	const resolveNetworkTipObservation = async (networkSelector: NetworkId) => {
		assertNetwork(networkSelector)
		const {
			estimateSmartFee,
			getBlock,
			getBlockCount,
			getBlockHash,
			getBlockTemplate,
			getMempoolInfo,
			getNetworkHashrate,
		} = await loadQueries()
		const tipHeight = await getBlockCount()
		const [bestBlockHash, mempoolInfo, template, hashesPerSecond, fee2Blocks, fee6Blocks, fee12Blocks, fee24Blocks] = await Promise.all([
			getBlockHash({
				height: BigInt(tipHeight),
			}),
			getMempoolInfo(),
			getBlockTemplate(),
			getNetworkHashrate({ blockWindow: 120 }),
			estimateSmartFee({ confirmationTarget: 2 }),
			estimateSmartFee({ confirmationTarget: 6 }),
			estimateSmartFee({ confirmationTarget: 12 }),
			estimateSmartFee({ confirmationTarget: 24 }),
		])
		const tipBlock = await getBlock({
			blockHash: bestBlockHash,
		})
		return {
			bestBlockHeight: BigInt(tipHeight),
			bestBlockHash,
			bestBlockTimeMs: tipBlock.time * 1000,
			blockCount: BigInt(tipHeight + 1),
			mempoolTransactionCount: mempoolInfo.size,
			mempoolSizeBytes: BigInt(mempoolInfo.bytes),
			hashrateHashesPerSecond: hashesPerSecond,
			hashrateBlockWindow: 120,
			...(fee2Blocks.feerate != null && { conservativeFeeRate2BlocksSatsPerKvb: BigInt(Math.round(fee2Blocks.feerate * 100_000_000)) }),
			...(fee6Blocks.feerate != null && { conservativeFeeRate6BlocksSatsPerKvb: BigInt(Math.round(fee6Blocks.feerate * 100_000_000)) }),
			...(fee12Blocks.feerate != null && { conservativeFeeRate12BlocksSatsPerKvb: BigInt(Math.round(fee12Blocks.feerate * 100_000_000)) }),
			...(fee24Blocks.feerate != null && { conservativeFeeRate24BlocksSatsPerKvb: BigInt(Math.round(fee24Blocks.feerate * 100_000_000)) }),
			miningTemplateHeight: BigInt(template.height),
			miningTemplatePreviousBlockHash: template.previousblockhash,
			miningTemplateTarget: template.target,
			miningTemplateCurrentTimeMs: template.curtime * 1000,
			miningTemplateMinimumTimeMs: template.mintime * 1000,
			miningTemplateCoinbaseValueSats: BigInt(template.coinbasevalue),
			miningTemplateTransactionCount: template.transactions.length,
			miningTemplateSizeLimitBytes: template.sizelimit,
			miningTemplateWeightLimit: template.weightlimit,
			miningTemplateSigopLimit: template.sigoplimit,
			miningTemplateRules: template.rules,
			miningTemplateMutableFields: template.mutable,
			miningTemplateNonceRange: template.noncerange,
			miningTemplateBits: template.bits,
			$$miningTemplateTransactions: template.transactions.map((transaction) => ({
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					txId: transaction.txid,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'weightUnits')]: transaction.weight,
					[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: BigInt(transaction.fee),
				},
			})),
		}
	}

	const resolveNetworkTipTimestamps = async (networkSelector: NetworkId) => {
		const tip = await resolveNetworkTipObservation(networkSelector)
		return [
			{
				[EntityMetaKey.Selector]: {
					$network: networkSelector,
					timestampMs: Date.now(),
					source,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: tip.bestBlockHeight,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: tip.bestBlockHash,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: tip.bestBlockTimeMs,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: tip.blockCount,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: tip.mempoolTransactionCount,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: tip.mempoolSizeBytes,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'hashrateHashesPerSecond')]: tip.hashrateHashesPerSecond,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'hashrateBlockWindow')]: tip.hashrateBlockWindow,
					...(tip.conservativeFeeRate2BlocksSatsPerKvb != null && {
						[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'conservativeFeeRate2BlocksSatsPerKvb')]: tip.conservativeFeeRate2BlocksSatsPerKvb,
					}),
					...(tip.conservativeFeeRate6BlocksSatsPerKvb != null && {
						[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'conservativeFeeRate6BlocksSatsPerKvb')]: tip.conservativeFeeRate6BlocksSatsPerKvb,
					}),
					...(tip.conservativeFeeRate12BlocksSatsPerKvb != null && {
						[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'conservativeFeeRate12BlocksSatsPerKvb')]: tip.conservativeFeeRate12BlocksSatsPerKvb,
					}),
					...(tip.conservativeFeeRate24BlocksSatsPerKvb != null && {
						[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'conservativeFeeRate24BlocksSatsPerKvb')]: tip.conservativeFeeRate24BlocksSatsPerKvb,
					}),
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateHeight')]: tip.miningTemplateHeight,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplatePreviousBlockHash')]: tip.miningTemplatePreviousBlockHash,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateTarget')]: tip.miningTemplateTarget,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateCurrentTimeMs')]: tip.miningTemplateCurrentTimeMs,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateMinimumTimeMs')]: tip.miningTemplateMinimumTimeMs,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateCoinbaseValueSats')]: tip.miningTemplateCoinbaseValueSats,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateTransactionCount')]: tip.miningTemplateTransactionCount,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateSizeLimitBytes')]: tip.miningTemplateSizeLimitBytes,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateWeightLimit')]: tip.miningTemplateWeightLimit,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateSigopLimit')]: tip.miningTemplateSigopLimit,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateRules')]: tip.miningTemplateRules,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateMutableFields')]: tip.miningTemplateMutableFields,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateNonceRange')]: tip.miningTemplateNonceRange,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'miningTemplateBits')]: tip.miningTemplateBits,
					[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], '$$miningTemplateTransactions')]: tip.$$miningTemplateTransactions,
				},
			},
		]
	}

	const networkResolve = {
		Caip2: {
			resolve: resolveUtxoBlocks,
		},
		...(acceptsSlugSelector && {
			Slug: {
				resolve: resolveUtxoBlocks,
			},
		}),
	}

	const networkTimestampListResolve = {
		Caip2: {
			resolve: resolveNetworkTipTimestamps,
		},
		...(acceptsSlugSelector && {
			Slug: {
				resolve: resolveNetworkTipTimestamps,
			},
		}),
	}

	return {
		source,

		resolvers: [
			...(loadMempoolTransactionIds == null ? [] : [
				defineResolver({
					entityType: EntityType.Network,
					resolve: {
						Caip2: {
							resolve: async (networkSelector, context) => {
								assertNetwork(networkSelector)
								return Promise.all(
									(await loadMempoolTransactionIds())
										.slice(
											context.pagination.offset ?? 0,
											(context.pagination.offset ?? 0) + resolverContextRowLimit(context)
										)
										.map(async (txId) => {
											const entitySelector = {
												$network: networkSelector,
												txId,
											}
											const snapshot = await utxoTransactionSnapshot(
												entitySelector,
												await getTransaction(entitySelector)
											)
											return {
												[EntityMetaKey.Selector]: snapshot[EntityMetaKey.Selector],
												[EntityMetaKey.Fields]: {
													[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'version')]: snapshot.version,
													[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'lockTime')]: snapshot.lockTime,
													[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'sizeBytes')]: snapshot.sizeBytes,
													[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: snapshot.virtualSizeBytes,
													[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'weightUnits')]: snapshot.weightUnits,
													[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'isCoinbase')]: snapshot.isCoinbase,
													[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$inputs')]: snapshot.$$inputs,
													[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$outputs')]: snapshot.$$outputs,
													[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$bitcoinOrdinalInscriptions')]: snapshot.$$bitcoinOrdinalInscriptions,
													...(snapshot.$bitcoinRunestone != null && {
														[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$bitcoinRunestone')]: snapshot.$bitcoinRunestone,
													}),
												},
											}
										})
								)
							},
						},
					},
				})({
					Utxo: {
						$$transactions: (transactions) => transactions,
					},
				}),
			]),
			defineResolver({
				entityType: EntityType.UtxoBlock,
				resolve: {
					NetworkHeight: {
						resolve: async ({ $network, height }) => {
							assertNetwork($network)
							const { getBlockHash } = await loadQueries()
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
							assertNetwork($network)
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
						resolve: async (entitySelector) => utxoTransactionSnapshot(
							entitySelector,
							await getTransaction(entitySelector)
						),
					}
				},
			})({
				version: (snapshot) => snapshot.version,
				lockTime: (snapshot) => snapshot.lockTime,
				sizeBytes: (snapshot) => snapshot.sizeBytes,
				virtualSizeBytes: (snapshot) => snapshot.virtualSizeBytes,
				weightUnits: (snapshot) => snapshot.weightUnits,
				isCoinbase: (snapshot) => snapshot.isCoinbase,
				$block: (snapshot) => snapshot.$block,
				$$inputs: (snapshot) => snapshot.$$inputs,
				$$outputs: (snapshot) => snapshot.$$outputs,
				$$bitcoinOrdinalInscriptions: (snapshot) => snapshot.$$bitcoinOrdinalInscriptions,
				$bitcoinRunestone: (snapshot) => snapshot.$bitcoinRunestone,
			}),

			defineResolver({
				entityType: EntityType.UtxoTransaction,
				resolve: {
					NetworkTxId: {
						resolve: async ({ $network, txId }) => {
							assertNetwork($network)
							const { getMempoolEntry } = await loadQueries()
							const entry = await getMempoolEntry({ txId })
							return {
								feeSats: BigInt(Math.round(entry.fees.base * 100_000_000)),
								$$mempoolTimestamps: [{
									[EntityMetaKey.Selector]: {
										$transaction: {
											$network,
											txId,
										},
										timestampMs: entry.observedAtMs,
										source,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'witnessTransactionId')]: entry.wtxid,
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'virtualSizeBytes')]: entry.vsize,
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'weightUnits')]: entry.weight,
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'ancestorCount')]: entry.ancestorcount,
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'ancestorSizeBytes')]: entry.ancestorsize,
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'descendantCount')]: entry.descendantcount,
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'descendantSizeBytes')]: entry.descendantsize,
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'baseFeeSats')]: BigInt(Math.round(entry.fees.base * 100_000_000)),
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'modifiedFeeSats')]: BigInt(Math.round(entry.fees.modified * 100_000_000)),
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'ancestorFeeSats')]: BigInt(Math.round(entry.fees.ancestor * 100_000_000)),
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'descendantFeeSats')]: BigInt(Math.round(entry.fees.descendant * 100_000_000)),
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'bip125Replaceable')]: entry['bip125-replaceable'],
										...(entry.unbroadcast != null && {
											[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], 'unbroadcast')]: entry.unbroadcast,
										}),
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], '$$dependsOnTransactions')]: entry.depends.map((relatedTransactionId) => ({
											[EntityMetaKey.Selector]: {
												$network,
												txId: relatedTransactionId,
											},
										})),
										[entityFieldAddressKey(EntityType.UtxoTransaction_Mempool_Timestamp, [], '$$spentByTransactions')]: entry.spentby.map((relatedTransactionId) => ({
											[EntityMetaKey.Selector]: {
												$network,
												txId: relatedTransactionId,
											},
										})),
									},
								}],
							}
						},
					},
				},
			})({
				feeSats: (snapshot) => snapshot.feeSats,
				$$mempoolTimestamps: (snapshot) => snapshot.$$mempoolTimestamps,
			}),

			defineResolver({
				entityType: EntityType.UtxoInput,
				resolve: {
					TransactionIndexInTransaction: {
						resolve: async ({ $transaction, indexInTransaction }) => {
							const input = (await getTransaction($transaction)).vin[indexInTransaction]
							// oxlint-disable-next-line typescript/no-unnecessary-condition -- Provider arrays can omit the requested runtime index despite TypeScript's unchecked indexed access.
							if (input == null)
								throw new Error(`${source}: transaction input ${indexInTransaction} not found`)

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
					}
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
						resolve: async ({ $transaction, indexInTransaction }) => {
							const transaction = await getTransaction($transaction)
							const output = transaction.vout[indexInTransaction]
							// oxlint-disable-next-line typescript/no-unnecessary-condition -- Provider arrays can omit the requested runtime index despite TypeScript's unchecked indexed access.
							if (output == null)
								throw new Error(`${source}: transaction output ${indexInTransaction} not found`)

							const runestone = runestonePayload(
								await bitcoinProtocolPayloadsFromTransaction(transaction)
							)
							return {
								[EntityMetaKey.Selector]: {
									$transaction: $transaction,
									indexInTransaction: indexInTransaction,
								},
								valueSats: BigInt(Math.round(output.value * 100_000_000)),
								scriptPubKeyAsm: output.scriptPubKey.asm,
								scriptPubKeyHex: output.scriptPubKey.hex,
								scriptPubKeyType: output.scriptPubKey.type,
								...(output.scriptPubKey.address != null && {
									$address: {
										[EntityMetaKey.Selector]: {
											$network: $transaction.$network,
											address: output.scriptPubKey.address,
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
				valueSats: (snapshot) => snapshot.valueSats,
				scriptPubKeyAsm: (snapshot) => snapshot.scriptPubKeyAsm,
				scriptPubKeyHex: (snapshot) => snapshot.scriptPubKeyHex,
				scriptPubKeyType: (snapshot) => snapshot.scriptPubKeyType,
				$address: (snapshot) => snapshot.$address,
				$bitcoinRunestone: (snapshot) => snapshot.$bitcoinRunestone,
			}),

			defineResolver({
				entityType: EntityType.BitcoinOrdinalInscription,
				resolve: {
					NetworkInscriptionId: {
						resolve: async ({ $network, inscriptionId }) => {
							const parsed = parseBitcoinInscriptionId(inscriptionId)
							if (parsed == null)
								throw new Error(`${source}: invalid inscription id ${inscriptionId}`)

							const payloads = ordinalsPayloads(
								await getBitcoinProtocolPayloads({
									$network,
									txId: parsed.txId,
								})
							)
							const payload = payloads[parsed.inscriptionIndex]
							// oxlint-disable-next-line typescript/no-unnecessary-condition -- Parsed inscription indexes can exceed the provider-derived payload array at runtime.
							if (payload == null)
								throw new Error(`${source}: inscription ${inscriptionId} not found in reveal transaction`)

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
						resolve: async ({ $transaction, outputIndex }) => {
							const payloads = await getBitcoinProtocolPayloads($transaction)
							const runestone = runestonePayload(payloads)
							if (runestone == null || runestone.location.outputIndex !== outputIndex)
								throw new Error(`${source}: runestone not found at output ${outputIndex}`)

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
				entityType: EntityType.UtxoAddress,
				resolve: {
					NetworkAddress: {
						resolve: async ({ $network, address }, context) => {
							assertNetwork($network)
							const { getTransparentAddressUtxos } = await loadQueries()
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
									[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: utxo.valueSatoshis,
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
							assertNetwork($network)
							const { getTransparentAddressUtxos } = await loadQueries()
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
											source,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'balanceSats')]: scan.totalAmountSatoshis,
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
				resolve: networkResolve,
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
							assertNetwork(parentEntitySelector)
							let timeout: ReturnType<typeof setTimeout> | undefined
							let lastHeight: number | undefined
							const poll = async () => {
								try {
									if (signal.aborted)
										return
									const { getBlockCount } = await loadQueries()
									const tipHeight = await getBlockCount()
									if (signal.aborted)
										return
									if (lastHeight !== tipHeight) {
										lastHeight = tipHeight
										fields.$$blocks.invalidate()
									}
								} catch (error) {
									console.error(`${source} live UTXO head failed`, error)
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
					$$blocks: {
						select: (snapshot) => snapshot.blocks,
						resolveCount: (snapshot) => BigInt(snapshot.tipHeight + 1),
					},
				},
			}),

			defineResolver({
				entityType: EntityType.Network,
				resolve: networkTimestampListResolve,
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
							assertNetwork(parentEntitySelector)
							let timeout: ReturnType<typeof setTimeout> | undefined
							const poll = async () => {
								try {
									if (signal.aborted)
										return
									const { getBlockCount } = await loadQueries()
									const tipHeight = await getBlockCount()
									if (signal.aborted)
										return
									fields.$$timestamps.replaceRows([{
										source,
										value: [{
											[EntityMetaKey.Selector]: {
												$network: parentEntitySelector,
												timestampMs: Date.now(),
												source,
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: BigInt(tipHeight),
												[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: BigInt(tipHeight) + 1n,
											},
										}],
									}])
								} catch (error) {
									console.error(`${source} live network head failed`, error)
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
		],
	}
}
