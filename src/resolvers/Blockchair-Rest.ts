import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import {
	networkBySlug,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import type {
	BlockchairBitcoinLikeBlockDashboard,
	BlockchairBitcoinLikeChain,
	BlockchairEthereumLikeChain,
} from '$/sources/Blockchair/Rest/types.ts'
type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const blockchairNetworkSlugs = [
	'bitcoin',
	'zcash',
	'litecoin',
	'dogecoin',
	'bitcoin-cash',
] as const

const blockchairEvmNetworkSlugs = [
	'ethereum',
] as const

const blockchairNetworkReferenceApplicability = blockchairNetworkSlugs.flatMap((slug) => ([
	{
		$network: {
			caip2: networkBySlug[slug].caip2,
		},
	},
	{
		$network: { slug },
	},
]))

const blockchairNetworkTimestampApplicability = blockchairNetworkReferenceApplicability.map(($network) => ({
	...$network,
	source: Source.Blockchair_Rest,
}))

const blockchairAddressTimestampApplicability = blockchairNetworkReferenceApplicability.map(($network) => ({
	$address: $network,
	source: Source.Blockchair_Rest,
}))

const blockchairTransactionReferenceApplicability = blockchairNetworkReferenceApplicability.map(($network) => ({
	$transaction: $network,
}))

const blockchairEvmNetworkReferenceApplicability = blockchairEvmNetworkSlugs.flatMap((slug) => ([
	{
		$network: {
			caip2: networkBySlug[slug].caip2,
		},
	},
	{
		$network: { slug },
	},
]))

const blockchairEvmNetworkTimestampApplicability = blockchairEvmNetworkReferenceApplicability.map(($network) => ({
	...$network,
	source: Source.Blockchair_Rest,
}))

const blockchairNetworkSelectors = <_Snapshot extends object>(
	resolve: (
		network: NetworkId,
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Caip2: {
		appliesTo: blockchairNetworkSlugs.map((slug) => ({
			caip2: networkBySlug[slug].caip2,
		})),
		resolve,
	},
	Slug: {
		appliesTo: blockchairNetworkSlugs.map((slug) => ({ slug })),
		resolve,
	},
})

const blockchairEvmNetworkSelectors = <_Snapshot extends object>(
	resolve: (
		network: NetworkId,
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Caip2: {
		appliesTo: blockchairEvmNetworkSlugs.map((slug) => ({
			caip2: networkBySlug[slug].caip2,
		})),
		resolve,
	},
	Slug: {
		appliesTo: blockchairEvmNetworkSlugs.map((slug) => ({ slug })),
		resolve,
	},
})

const blockchairChain = (
	network: NetworkId
): BlockchairBitcoinLikeChain => {
	const caip2 = (
		'caip2' in network ?
			network.caip2
		:
			networkBySlug[network.slug]?.caip2
	)
	if (caip2 == null)
		throw new Error('Blockchair_Rest: unsupported UTXO network')
	if (
		caip2.namespace === networkBySlug.bitcoin.caip2.namespace
		&& caip2.reference === networkBySlug.bitcoin.caip2.reference
	) return 'bitcoin'
	if (caip2.namespace === networkBySlug.zcash.caip2.namespace && caip2.reference === networkBySlug.zcash.caip2.reference) return 'zcash'
	if (caip2.namespace === networkBySlug.litecoin.caip2.namespace && caip2.reference === networkBySlug.litecoin.caip2.reference) return 'litecoin'
	if (caip2.namespace === networkBySlug.dogecoin.caip2.namespace && caip2.reference === networkBySlug.dogecoin.caip2.reference) return 'dogecoin'
	if (caip2.namespace === networkBySlug['bitcoin-cash'].caip2.namespace && caip2.reference === networkBySlug['bitcoin-cash'].caip2.reference) return 'bitcoin-cash'
	throw new Error(`Blockchair_Rest: unsupported UTXO network ${caip2.namespace}:${caip2.reference}`)
}

const blockchairEthereumChain = (
	network: NetworkId
): BlockchairEthereumLikeChain => {
	const caip2 = (
		'caip2' in network ?
			network.caip2
		:
			networkBySlug[network.slug]?.caip2
	)
	if (caip2 == null)
		throw new Error('Blockchair_Rest: unsupported EVM network')
	if (
		caip2.namespace === networkBySlug.ethereum.caip2.namespace
		&& caip2.reference === networkBySlug.ethereum.caip2.reference
	) return 'ethereum'
	throw new Error(`Blockchair_Rest: unsupported EVM network ${caip2.namespace}:${caip2.reference}`)
}

const firstDashboardEntry = <_Row>(dashboardRows: Record<string, _Row>, subject: string) => {
	for (const dashboardEntry of Object.entries(dashboardRows))
		return dashboardEntry

	throw new Error(`Blockchair_Rest: no dashboard for ${subject}`)
}

const firstDashboardRow = <_Row>(dashboardRows: Record<string, _Row>, subject: string) => {
	return firstDashboardEntry(dashboardRows, subject)[1]
}

const timestampMsFromBlockchairTime = (time: string | undefined) => (
	((timestampMs) => (
		Number.isNaN(timestampMs) ? undefined : timestampMs
	))(time == null ? Number.NaN : Date.parse(time))
)

const bigintFromNumber = (value: number | undefined) => (
	value == null ? undefined : BigInt(value)
)

const virtualSizeBytesFromWeight = (weight: number | undefined) => (
	weight == null ? undefined : Math.ceil(weight / 4)
)

const blockchairCount = (
	value: number | undefined,
	label: string
) => {
	if (value == null || !Number.isSafeInteger(value) || value < 0)
		throw new Error(`Blockchair_Rest: invalid ${label} count ${value}`)

	return value
}

const requestOptions = (context: ResolverContext) => ({
	publicEnv: context.publicEnv,
})

const getTransactionDashboard = async ({
	$network,
	txId,
	context,
}: {
	$network: NetworkId
	txId: string
	context: ResolverContext
}) => {
	const { getBitcoinLikeTransactionDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
	return firstDashboardRow(
		(
			await getBitcoinLikeTransactionDashboard({
				chain: blockchairChain($network),
				transactionHash: txId,
				options: requestOptions(context),
			})
		).data,
		txId
	)
}

const getAddressDashboard = async ({
	$network,
	address,
	context,
	params,
}: {
	$network: NetworkId
	address: string
	context: ResolverContext
	params?: {
		limit?: number
	}
}) => {
	const { getBitcoinLikeAddressDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
	return firstDashboardRow(
		(
			await getBitcoinLikeAddressDashboard({
				chain: blockchairChain($network),
				address,
				params,
				options: requestOptions(context),
			})
		).data,
		address
	)
}

const blockDashboardSnapshot = (
	$network: NetworkId,
	hash: string,
	dashboard: BlockchairBitcoinLikeBlockDashboard
) => ({
	hash,
		...(
			dashboard.block.id > 0
		&& {
			$parent: {
				[EntityMetaKey.Selector]: {
					$network,
					height: BigInt(dashboard.block.id - 1),
				},
			},
		}
	),
	...(dashboard.block.time != null && {
		timestampMs: Date.parse(dashboard.block.time),
	}),
	merkleRoot: dashboard.block.merkle_root,
	...(dashboard.block.nonce != null && {
		nonce: dashboard.block.nonce,
	}),
	difficulty: dashboard.block.difficulty,
	sizeBytes: dashboard.block.size,
	weightUnits: dashboard.block.weight,
	transactionCount: dashboard.block.transaction_count,
	$$transactions: dashboard.transactions.map((transaction) => ({
		[EntityMetaKey.Selector]: {
			$network,
			txId: transaction.hash,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$block')]: {
				[EntityMetaKey.Selector]: {
					$network,
					height: BigInt(dashboard.block.id),
					hash,
				},
			},
			...(transaction.version != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'version')]: transaction.version,
			}),
			...(transaction.lock_time != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'lockTime')]: transaction.lock_time,
			}),
			...(transaction.size != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'sizeBytes')]: transaction.size,
			}),
			...((virtualSizeBytes) => virtualSizeBytes != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: virtualSizeBytes,
			})(
				virtualSizeBytesFromWeight(transaction.weight) ?? transaction.size
			),
			...(transaction.weight != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'weightUnits')]: transaction.weight,
			}),
			...(transaction.fee != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: BigInt(transaction.fee),
			}),
			...(transaction.is_coinbase != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'isCoinbase')]: transaction.is_coinbase,
			}),
		},
	})),
})

export default {
	source: Source.Blockchair_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: blockchairNetworkSelectors(async (network) => ({
				[EntityMetaKey.Selector]: network,
				slug: blockchairChain(network),
			})),
		})({
			slug: (network) => network.slug,
		}),

		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: blockchairNetworkReferenceApplicability,
					resolve: async ({ $network, height }, context) => {
						const { getBitcoinLikeBlockDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
						const [hash, dashboard] = firstDashboardEntry(
							(
								await getBitcoinLikeBlockDashboard({
									chain: blockchairChain($network),
									block: height,
									options: requestOptions(context),
								})
							).data,
							height.toString()
						)
						return blockDashboardSnapshot(
							$network,
							hash,
							dashboard
						)
					},
				},
				NetworkHeightHash: {
					appliesTo: blockchairNetworkReferenceApplicability,
					resolve: async ({ $network, hash }, context) => {
						const { getBitcoinLikeBlockDashboard } = await import('$/sources/Blockchair/Rest/queries.ts')
						const dashboard = firstDashboardRow(
							(
								await getBitcoinLikeBlockDashboard({
									chain: blockchairChain($network),
									block: hash,
									options: requestOptions(context),
								})
							).data,
							hash
						)
						return blockDashboardSnapshot(
							$network,
							dashboard.block.hash,
							dashboard
						)
					},
				},
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
			$$transactions: (block) => block.$$transactions,
		}),

		defineResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: {
				NetworkTxId: {
					appliesTo: blockchairNetworkReferenceApplicability,
					resolve: async (entitySelector, context) => {
						const transactionDashboard = await getTransactionDashboard({
							...entitySelector,
							context,
						})
						return {
							...(transactionDashboard.transaction.block_id != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network: entitySelector.$network,
										height: BigInt(transactionDashboard.transaction.block_id),
									},
								},
							}),
							version: transactionDashboard.transaction.version,
							lockTime: transactionDashboard.transaction.lock_time,
							sizeBytes: transactionDashboard.transaction.size,
							virtualSizeBytes: (
								virtualSizeBytesFromWeight(transactionDashboard.transaction.weight)
								?? transactionDashboard.transaction.size
							),
							weightUnits: transactionDashboard.transaction.weight,
							...(transactionDashboard.transaction.fee != null && {
								feeSats: BigInt(transactionDashboard.transaction.fee),
							}),
							isCoinbase: transactionDashboard.transaction.is_coinbase,
							$$inputs: transactionDashboard.inputs.map((input, indexInTransaction) => ({
								[EntityMetaKey.Selector]: {
									$transaction: entitySelector,
									indexInTransaction,
								},
								[EntityMetaKey.Fields]: {
									...(input.transaction_hash != null && input.index != null && {
										[entityFieldAddressKey(EntityType.UtxoInput, [], '$spentOutput')]: {
											[EntityMetaKey.Selector]: {
												$transaction: {
													$network: entitySelector.$network,
													txId: input.transaction_hash,
												},
												indexInTransaction: input.index,
											},
										},
									}),
									...(input.script_hex != null && {
										[entityFieldAddressKey(EntityType.UtxoInput, [], 'scriptSigAsm')]: input.script_hex,
									}),
									...(input.spending_sequence != null && {
										[entityFieldAddressKey(EntityType.UtxoInput, [], 'sequence')]: input.spending_sequence,
									}),
									...(input.spending_witness != null && {
										[entityFieldAddressKey(EntityType.UtxoInput, [], 'witness')]: [
											input.spending_witness,
										],
									}),
								},
							})),
							$$outputs: transactionDashboard.outputs.map((output, indexInTransaction) => ({
								[EntityMetaKey.Selector]: {
									$transaction: entitySelector,
									indexInTransaction,
								},
								[EntityMetaKey.Fields]: {
									...(output.value != null && {
										[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: BigInt(output.value),
									}),
									...(output.script_hex != null && {
										[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: output.script_hex,
									}),
									...(output.type != null && {
										[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyType')]: output.type,
									}),
									...(output.recipient != null && {
										[entityFieldAddressKey(EntityType.UtxoOutput, [], '$address')]: {
											[EntityMetaKey.Selector]: {
												$network: entitySelector.$network,
												address: output.recipient,
											},
										},
									}),
									[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: output.spending_transaction_hash != null,
								},
							})),
						}
					},
				}
			},
		})({
			$block: (transaction) => transaction.$block,
			version: (transaction) => transaction.version,
			lockTime: (transaction) => transaction.lockTime,
			sizeBytes: (transaction) => transaction.sizeBytes,
			virtualSizeBytes: (transaction) => transaction.virtualSizeBytes,
			weightUnits: (transaction) => transaction.weightUnits,
			feeSats: (transaction) => transaction.feeSats,
			isCoinbase: (transaction) => transaction.isCoinbase,
			$$inputs: (transaction) => transaction.$$inputs,
			$$outputs: (transaction) => transaction.$$outputs,
		}),

		defineResolver({
			entityType: EntityType.UtxoAddress,
			resolve: {
				NetworkAddress: {
					appliesTo: blockchairNetworkReferenceApplicability,
					resolve: async ({ $network, address }) => ({
						address,
						$$timestamps: [
							{
								[EntityMetaKey.Selector]: {
									$address: {
										$network,
										address,
									},
									timestampMs: Date.now(),
									source: Source.Blockchair_Rest,
								},
							},
						],
					}),
				},
			},
		})({
			address: (address) => address.address,
			$$timestamps: (address) => address.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.UtxoAddress,
			resolve: {
				NetworkAddress: {
					appliesTo: blockchairNetworkReferenceApplicability,
					resolve: async ({ $network, address }, context) => {
						const dashboard = await getAddressDashboard({
							$network,
							address,
							context,
							params: {
								limit: resolverContextRowLimit(context),
							},
						})
						return {
							$$transactions: dashboard.transactions.map((transaction) => (
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
											txId: transaction.hash,
										},
										[EntityMetaKey.Fields]: {
											...(transaction.block_id != null && {
												[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$block')]: {
													[EntityMetaKey.Selector]: {
														$network,
														height: BigInt(transaction.block_id),
													},
												},
											}),
											...(transaction.version != null && {
												[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'version')]: transaction.version,
											}),
											...(transaction.lock_time != null && {
												[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'lockTime')]: transaction.lock_time,
											}),
											...(transaction.size != null && {
												[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'sizeBytes')]: transaction.size,
											}),
											...((virtualSizeBytes) => virtualSizeBytes != null && {
												[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: virtualSizeBytes,
											})(virtualSizeBytesFromWeight(transaction.weight) ?? transaction.size),
											...(transaction.weight != null && {
												[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'weightUnits')]: transaction.weight,
											}),
											...(transaction.fee != null && {
												[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: BigInt(transaction.fee),
											}),
											...(transaction.is_coinbase != null && {
												[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'isCoinbase')]: transaction.is_coinbase,
											}),
										},
									}
							)),
							$$outputs: (dashboard.utxo ?? []).flatMap((output) => (
								output.transaction_hash == null || output.index == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$transaction: {
												$network,
												txId: output.transaction_hash,
											},
											indexInTransaction: output.index,
										},
										[EntityMetaKey.Fields]: {
											...(output.value != null && {
												[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: BigInt(output.value),
											}),
											...(output.script_hex != null && {
												[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: output.script_hex,
											}),
											...(output.type != null && {
												[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyType')]: output.type,
											}),
											...(output.recipient != null && {
												[entityFieldAddressKey(EntityType.UtxoOutput, [], '$address')]: {
													[EntityMetaKey.Selector]: {
														$network,
														address: output.recipient,
													},
												},
											}),
											[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: output.spending_transaction_hash != null,
										},
									}]
							)),
						}
					},
				},
			},
		})({
			$$transactions: (address) => address.$$transactions,
			$$outputs: (address) => address.$$outputs,
		}),

		defineResolver({
			entityType: EntityType.UtxoAddress_Timestamp,
			resolve: {
				AddressTimestampMsSource: {
					appliesTo: blockchairAddressTimestampApplicability,
					resolve: async ({ $address }, context) => (
						await getAddressDashboard({
							...$address,
							context,
						})
					).address,
				},
			},
		})({
			balanceSats: (address) => bigintFromNumber(address.balance),
			transactionCount: (address) => address.transaction_count,
			unspentOutputCount: (address) => address.unspent_output_count,
			fundedOutputCount: (address) => address.output_count,
			spentOutputCount: (address) => (
				address.output_count == null || address.unspent_output_count == null ?
					undefined
				:
					address.output_count - address.unspent_output_count
			),
			fundedValueSats: (address) => bigintFromNumber(address.received),
			spentValueSats: (address) => bigintFromNumber(address.spent),
		}),

		defineResolver({
			entityType: EntityType.UtxoInput,
			resolve: {
				TransactionIndexInTransaction: {
					appliesTo: blockchairTransactionReferenceApplicability,
					resolve: async ({ $transaction, indexInTransaction }, context) => {
						const input = (await getTransactionDashboard({
							...$transaction,
							context,
						})).inputs.at(indexInTransaction)
						if (input == null)
							throw new Error(`Blockchair_Rest: transaction input ${indexInTransaction} not found`)

						return {
							[EntityMetaKey.Selector]: {
								$transaction: $transaction,
								indexInTransaction: indexInTransaction,
							},
							...(input.transaction_hash != null && input.index != null && {
								$spentOutput: {
									[EntityMetaKey.Selector]: {
										$transaction: {
											$network: $transaction.$network,
											txId: input.transaction_hash,
										},
										indexInTransaction: input.index,
									},
								},
							}),
							...(input.script_hex != null && {
								scriptSigAsm: input.script_hex,
							}),
							...(input.spending_sequence != null && {
								sequence: input.spending_sequence,
							}),
							...(input.spending_witness != null && {
								witness: [
									input.spending_witness,
								],
							}),
						}
					},
				}
			},
		})({
			$spentOutput: (input) => input.$spentOutput,
			scriptSigAsm: (input) => input.scriptSigAsm,
			sequence: (input) => input.sequence,
			witness: (input) => input.witness ?? [],
		}),

		defineResolver({
			entityType: EntityType.UtxoOutput,
			resolve: {
				TransactionIndexInTransaction: {
					appliesTo: blockchairTransactionReferenceApplicability,
					resolve: async ({ $transaction, indexInTransaction }, context) => {
						const output = (await getTransactionDashboard({
							...$transaction,
							context,
						})).outputs.at(indexInTransaction)
						if (output == null)
							throw new Error(`Blockchair_Rest: transaction output ${indexInTransaction} not found`)

						return {
							[EntityMetaKey.Selector]: {
								$transaction: $transaction,
								indexInTransaction: indexInTransaction,
							},
							...(output.value != null && {
								valueSats: BigInt(output.value),
							}),
							...(output.script_hex != null && {
								scriptPubKeyHex: output.script_hex,
							}),
							...(output.type != null && {
								scriptPubKeyType: output.type,
							}),
							...(output.recipient != null && {
								$address: {
									[EntityMetaKey.Selector]: {
										$network: $transaction.$network,
										address: output.recipient,
									},
								},
							}),
							isSpent: output.spending_transaction_hash != null,
						}
					},
				}
			},
		})({
			valueSats: (output) => output.valueSats,
			scriptPubKeyHex: (output) => output.scriptPubKeyHex,
			scriptPubKeyType: (output) => output.scriptPubKeyType,
			$address: (output) => output.$address,
			isSpent: (output) => output.isSpent,
		}),

		defineResolver({
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: blockchairNetworkTimestampApplicability,
					resolve: async ({
						$network,
						timestampMs,
						source,
					}, context) => {
						if (source !== Source.Blockchair_Rest)
							throw new Error(`Blockchair_Rest: unsupported network timestamp source ${source}`)

						const { getBitcoinLikeStats } = await import('$/sources/Blockchair/Rest/queries.ts')
						const stats = (await getBitcoinLikeStats({
							chain: blockchairChain($network),
							options: requestOptions(context),
						})).data
						const bestBlockHeight = bigintFromNumber(stats.best_block_height)
						const blockCount = bigintFromNumber(stats.blocks)
						const transactionCount = bigintFromNumber(stats.transactions)
						const mempoolSizeBytes = bigintFromNumber(stats.mempool_size)
						const averageTransactionFee24hSats = bigintFromNumber(stats.average_transaction_fee_24h)
						const medianTransactionFee24hSats = bigintFromNumber(stats.median_transaction_fee_24h)
						const blockchainSizeBytes = bigintFromNumber(stats.blockchain_size)
						const bestBlockTimeMs = timestampMsFromBlockchairTime(stats.best_block_time)
						if (bestBlockTimeMs != null && bestBlockTimeMs !== timestampMs)
							throw new Error(
								`Blockchair_Rest: network timestamp mismatch ${bestBlockTimeMs} !== ${timestampMs}`
							)

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							ledgerModels: [NetworkLedgerModel.Utxo],
							executionModels: [],
							...(bestBlockHeight != null && { bestBlockHeight }),
							...(stats.best_block_hash != null && {
								bestBlockHash: stats.best_block_hash,
							}),
							...(bestBlockTimeMs != null && { bestBlockTimeMs }),
							...(blockCount != null && { blockCount }),
							...(transactionCount != null && { transactionCount }),
							...(stats.blocks_24h != null && { blocks24h: stats.blocks_24h }),
							...(stats.transactions_24h != null && {
								transactions24h: stats.transactions_24h,
							}),
							...(stats.mempool_transactions != null && {
								mempoolTransactionCount: stats.mempool_transactions,
							}),
							...(mempoolSizeBytes != null && { mempoolSizeBytes }),
							...(stats.mempool_tps != null && { mempoolTps: stats.mempool_tps }),
							...(averageTransactionFee24hSats != null && {
								averageTransactionFee24hSats,
							}),
							...(medianTransactionFee24hSats != null && {
								medianTransactionFee24hSats,
							}),
							...(stats.suggested_transaction_fee_per_byte_sat != null && {
								suggestedTransactionFeePerByteSats:
									stats.suggested_transaction_fee_per_byte_sat,
							}),
							...(blockchainSizeBytes != null && { blockchainSizeBytes }),
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
				blockCount: (timestamp) => timestamp.blockCount,
				transactionCount: (timestamp) => timestamp.transactionCount,
				blocks24h: (timestamp) => timestamp.blocks24h,
				transactions24h: (timestamp) => timestamp.transactions24h,
				mempoolTransactionCount: (timestamp) => timestamp.mempoolTransactionCount,
				mempoolSizeBytes: (timestamp) => timestamp.mempoolSizeBytes,
				mempoolTps: (timestamp) => timestamp.mempoolTps,
				averageTransactionFee24hSats: (timestamp) => timestamp.averageTransactionFee24hSats,
				medianTransactionFee24hSats: (timestamp) => timestamp.medianTransactionFee24hSats,
				suggestedTransactionFeePerByteSats: (timestamp) => timestamp.suggestedTransactionFeePerByteSats,
				blockchainSizeBytes: (timestamp) => timestamp.blockchainSizeBytes,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: blockchairNetworkSelectors(async (network, context) => {
				const { getBitcoinLikeStats } = await import('$/sources/Blockchair/Rest/queries.ts')
				const stats = (await getBitcoinLikeStats({
					chain: blockchairChain(network),
					options: requestOptions(context),
				})).data
				const bestBlockTimeMs = timestampMsFromBlockchairTime(stats.best_block_time)
				return {
					$$timestamps: [
						{
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: bestBlockTimeMs ?? Date.now(),
								source: Source.Blockchair_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'ledgerModels')]: [
									NetworkLedgerModel.Utxo,
								],
								[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'executionModels')]: [],
								...(stats.best_block_height != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: BigInt(stats.best_block_height),
								}),
								...(stats.best_block_hash != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: stats.best_block_hash,
								}),
								...(bestBlockTimeMs != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: bestBlockTimeMs,
								}),
								...(stats.blocks != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: BigInt(stats.blocks),
								}),
								...(stats.transactions != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'transactionCount')]: BigInt(stats.transactions),
								}),
								...(stats.blocks_24h != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blocks24h')]: stats.blocks_24h,
								}),
								...(stats.transactions_24h != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'transactions24h')]: stats.transactions_24h,
								}),
								...(stats.mempool_transactions != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: stats.mempool_transactions,
								}),
								...(stats.mempool_size != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: BigInt(stats.mempool_size),
								}),
								...(stats.mempool_tps != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTps')]: stats.mempool_tps,
								}),
								...(stats.average_transaction_fee_24h != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'averageTransactionFee24hSats')]: BigInt(stats.average_transaction_fee_24h),
								}),
								...(stats.median_transaction_fee_24h != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'medianTransactionFee24hSats')]: BigInt(stats.median_transaction_fee_24h),
								}),
								...(stats.suggested_transaction_fee_per_byte_sat != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'suggestedTransactionFeePerByteSats')]: stats.suggested_transaction_fee_per_byte_sat,
								}),
								...(stats.blockchain_size != null && {
									[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockchainSizeBytes')]: BigInt(stats.blockchain_size),
								}),
							},
						},
					],
					blocks: stats.blocks,
					transactions: stats.transactions,
				}
			}),
		})({
			$$timestamps: (network) => network.$$timestamps,
			Utxo: {
				$$blocks: {
					resolveCount: (network) => blockchairCount(network.blocks, 'block'),
				},
				$$transactions: {
					resolveCount: (network) => blockchairCount(network.transactions, 'transaction'),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: blockchairNetworkSelectors(async (network, context) => {
				const { getBlocks } = await import('$/sources/Blockchair/Rest/queries.ts')
				const offset = context.providerContinuationToken == null ?
					context.pagination.offset ?? 0
				:
					Number(context.providerContinuationToken)
				if (!Number.isSafeInteger(offset) || offset < 0)
					throw new Error('Blockchair_Rest: invalid block continuation')

				const chain = blockchairChain(network)
				const rows = (await getBlocks({
					chain,
					params: {
						sort: 'id(desc)',
						limit: resolverContextRowLimit(context),
						offset,
					},
					options: requestOptions(context),
				})).data.map((block) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						height: BigInt(block.id),
						hash: block.hash,
					},
					[EntityMetaKey.Fields]: {
						...(block.id > 0 && {
							[entityFieldAddressKey(EntityType.UtxoBlock, [], '$parent')]: {
								[EntityMetaKey.Selector]: {
									$network: network,
									height: BigInt(block.id - 1),
								},
							},
						}),
						...((timestampMs) => timestampMs != null && {
							[entityFieldAddressKey(EntityType.UtxoBlock, [], 'timestampMs')]: timestampMs,
						})(timestampMsFromBlockchairTime(block.time)),
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
						...(block.transaction_count != null && {
							[entityFieldAddressKey(EntityType.UtxoBlock, [], 'transactionCount')]: block.transaction_count,
						}),
					},
				}))
				return {
					chain,
					offset,
					rows,
				}
			}),
		})({
			Utxo: {
				$$blocks: {
					select: (snapshot) => snapshot.rows,
					continuation: (snapshot, context) => ({
						operation: 'network-blocks',
						target: snapshot.chain,
						terminal: snapshot.rows.length < resolverContextRowLimit(context),
						...(snapshot.rows.length >= resolverContextRowLimit(context) && {
							token: String(snapshot.offset + snapshot.rows.length),
						}),
					}),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: blockchairNetworkSelectors(async (network, context) => {
				const { getTransactions } = await import('$/sources/Blockchair/Rest/queries.ts')
				const offset = context.providerContinuationToken == null ?
					context.pagination.offset ?? 0
				:
					Number(context.providerContinuationToken)
				if (!Number.isSafeInteger(offset) || offset < 0)
					throw new Error('Blockchair_Rest: invalid transaction continuation')

				const chain = blockchairChain(network)
				const rows = (await getTransactions({
					chain,
					params: {
						sort: 'id(desc)',
						limit: resolverContextRowLimit(context),
						offset,
					},
					options: requestOptions(context),
				})).data.map((transaction) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						txId: transaction.hash,
					},
					[EntityMetaKey.Fields]: {
						...(transaction.block_id != null && {
							[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$block')]: {
								[EntityMetaKey.Selector]: {
									$network: network,
									height: BigInt(transaction.block_id),
								},
							},
						}),
						...(transaction.version != null && {
							[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'version')]: transaction.version,
						}),
						...(transaction.lock_time != null && {
							[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'lockTime')]: transaction.lock_time,
						}),
						...(transaction.size != null && {
							[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'sizeBytes')]: transaction.size,
						}),
						...((virtualSizeBytes) => virtualSizeBytes != null && {
							[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: virtualSizeBytes,
						})(virtualSizeBytesFromWeight(transaction.weight) ?? transaction.size),
						...(transaction.weight != null && {
							[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'weightUnits')]: transaction.weight,
						}),
						...(transaction.fee != null && {
							[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: BigInt(transaction.fee),
						}),
						...(transaction.is_coinbase != null && {
							[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'isCoinbase')]: transaction.is_coinbase,
						}),
					},
				}))
				return {
					chain,
					offset,
					rows,
				}
			}),
		})({
			Utxo: {
				$$transactions: {
					select: (snapshot) => snapshot.rows,
					continuation: (snapshot, context) => ({
						operation: 'network-transactions',
						target: snapshot.chain,
						terminal: snapshot.rows.length < resolverContextRowLimit(context),
						...(snapshot.rows.length >= resolverContextRowLimit(context) && {
							token: String(snapshot.offset + snapshot.rows.length),
						}),
					}),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: blockchairEvmNetworkSelectors(async (network, context) => {
				const { getEthereumLikeStats } = await import('$/sources/Blockchair/Rest/queries.ts')
				const stats = (await getEthereumLikeStats({
					chain: blockchairEthereumChain(network),
					options: requestOptions(context),
				})).data
				const bestBlockTimeMs = timestampMsFromBlockchairTime(stats.best_block_time)

				return {
					$$timestamps: [
						{
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: bestBlockTimeMs ?? Date.now(),
								source: Source.Blockchair_Rest,
							},
							[EntityMetaKey.Fields]: {
								...(stats.best_block_height != null && {
									[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: BigInt(stats.best_block_height),
								}),
							},
						},
					],
					blocks: stats.blocks,
				}
			}),
		})({
			Evm: {
				$$timestamps: (network) => network.$$timestamps,
				$$blocks: {
					resolveCount: (network) => blockchairCount(network.blocks, 'block'),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: blockchairEvmNetworkTimestampApplicability,
					resolve: async ({
						$network,
						timestampMs,
						source,
					}, context) => {
						if (source !== Source.Blockchair_Rest)
							throw new Error(`Blockchair_Rest: unsupported EVM network timestamp source ${source}`)

						const { getEthereumLikeStats } = await import('$/sources/Blockchair/Rest/queries.ts')
						const stats = (await getEthereumLikeStats({
							chain: blockchairEthereumChain($network),
							options: requestOptions(context),
						})).data
						const bestBlockHeight = bigintFromNumber(stats.best_block_height)
						if (bestBlockHeight == null)
							throw new Error('Blockchair_Rest: ethereum stats missing best_block_height')
						const bestBlockTimeMs = timestampMsFromBlockchairTime(stats.best_block_time)
						if (bestBlockTimeMs != null && bestBlockTimeMs !== timestampMs)
							throw new Error(
								`Blockchair_Rest: EVM network timestamp mismatch ${bestBlockTimeMs} !== ${timestampMs}`
							)

						return {
							[EntityMetaKey.Selector]: {
								$network,
								timestampMs,
								source,
							},
							blockHeight: bestBlockHeight,
						}
					},
				},
			},
		})({
			blockHeight: (timestamp) => timestamp.blockHeight,
		}),

	],
} satisfies RegisteredSourceResolverModule
