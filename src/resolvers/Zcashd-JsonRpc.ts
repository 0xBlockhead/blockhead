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
	type EntitySelector,
	type EntitySelectorForSelectorName,
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedActionKind.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPoolKind.ts'
import { Source } from '$/sources/Source.ts'

type NetworkSelector = EntitySelector<typeof schema, EntityType.Network>
type TransactionSelector = EntitySelector<typeof schema, EntityType.UtxoTransaction>
type UtxoBlockHeightSelector = EntitySelectorForSelectorName<
	typeof schema,
	EntityType.UtxoBlock,
	'NetworkHeight'
>
type UtxoBlockHeightHashSelector = EntitySelectorForSelectorName<
	typeof schema,
	EntityType.UtxoBlock,
	'NetworkHeightHash'
>

const assertZcashMainnet = (network: NetworkSelector) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== networkBySlug.zcash.caip2.namespace
				|| network.caip2.reference !== networkBySlug.zcash.caip2.reference
			)
		:
			network.slug !== networkBySlug.zcash.slug
	)
		throw new Error('Zcashd_JsonRpc: unsupported network')
}

const zcashShieldedPoolReference = (
	network: NetworkSelector,
	pool: ZcashShieldedPoolKind
) => ({
	[EntityMetaKey.Selector]: {
		$network: network,
		pool,
	},
})

const zcashShieldedActionSnapshots = (
	entitySelector: TransactionSelector,
	transaction: Awaited<ReturnType<typeof import('$/sources/Zcashd/JsonRpc/queries.ts')['getRawTransaction']>>
) => [
	...(transaction.vjoinsplit ?? []).map((joinSplit, indexInTransaction) => ({
		$transaction: entitySelector,
		pool: ZcashShieldedPoolKind.Sprout,
		actionKind: ZcashShieldedActionKind.JoinSplit,
		indexInTransaction,
		$pool: zcashShieldedPoolReference(entitySelector.$network, ZcashShieldedPoolKind.Sprout),
		nullifier: joinSplit.nullifiers[0],
		noteCommitment: joinSplit.commitments[0],
	})),
	...(transaction.vShieldedSpend ?? []).map((spend, indexInTransaction) => ({
		$transaction: entitySelector,
		pool: ZcashShieldedPoolKind.Sapling,
		actionKind: ZcashShieldedActionKind.Spend,
		indexInTransaction,
		$pool: zcashShieldedPoolReference(entitySelector.$network, ZcashShieldedPoolKind.Sapling),
		nullifier: spend.nullifier,
		valueCommitment: spend.cv,
	})),
	...(transaction.vShieldedOutput ?? []).map((output, indexInTransaction) => ({
		$transaction: entitySelector,
		pool: ZcashShieldedPoolKind.Sapling,
		actionKind: ZcashShieldedActionKind.Output,
		indexInTransaction,
		$pool: zcashShieldedPoolReference(entitySelector.$network, ZcashShieldedPoolKind.Sapling),
		noteCommitment: output.cmu,
		valueCommitment: output.cv,
	})),
	...(transaction.orchard?.actions ?? []).map((action, indexInTransaction) => ({
		$transaction: entitySelector,
		pool: ZcashShieldedPoolKind.Orchard,
		actionKind: ZcashShieldedActionKind.Action,
		indexInTransaction,
		$pool: zcashShieldedPoolReference(entitySelector.$network, ZcashShieldedPoolKind.Orchard),
		nullifier: action.nullifier,
		noteCommitment: action.cmx,
		valueCommitment: action.cv,
	})),
]

const getTransaction = async ({ $network, txId }: TransactionSelector) => {
	assertZcashMainnet($network)
	const { getRawTransaction } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
	return getRawTransaction({
		txId,
	})
}

const validActionKindsByPool = {
	[ZcashShieldedPoolKind.Sprout]: [ZcashShieldedActionKind.JoinSplit],
	[ZcashShieldedPoolKind.Sapling]: [
		ZcashShieldedActionKind.Spend,
		ZcashShieldedActionKind.Output,
	],
	[ZcashShieldedPoolKind.Orchard]: [ZcashShieldedActionKind.Action],
} as const

const zcashNetworkApplicability = [
	{
		$network: {
			caip2: networkBySlug.zcash.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.zcash.slug,
		},
	},
] as const

const zcashPoolStateSnapshots = async (
	$block: UtxoBlockHeightSelector | UtxoBlockHeightHashSelector,
	block: number | string
) => {
	assertZcashMainnet($block.$network)
	const { getTreeState } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
	const treeState = await getTreeState({
		block,
	})
	if (
		treeState.height !== Number($block.height)
		|| ('hash' in $block && treeState.hash !== $block.hash)
	)
		throw new Error('Zcashd_JsonRpc: z_gettreestate returned a different block')

	return [
		{
			$block,
			$pool: {
				$network: $block.$network,
				pool: ZcashShieldedPoolKind.Sapling,
			},
			saplingTree: treeState.sapling?.commitments,
		},
		{
			$block,
			$pool: {
				$network: $block.$network,
				pool: ZcashShieldedPoolKind.Orchard,
			},
			orchardTree: treeState.orchard?.commitments,
		},
	]
}

const utxoBlockSnapshot = async (
	$network: NetworkSelector,
	blockHash: string
) => {
	const { getBlock } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
	const block = await getBlock({
		blockHash,
	})
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
	network: NetworkSelector,
	context: Parameters<typeof resolverContextRowLimit>[0]
) => {
	assertZcashMainnet(network)
	const {
		getBlockCount,
		getBlockHash,
	} = await import('$/sources/Zcashd/JsonRpc/queries.ts')
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

const resolveNetworkTipObservation = async (network: NetworkSelector) => {
	assertZcashMainnet(network)
	const {
		getBlock,
		getBlockCount,
		getBlockHash,
		getMempoolInfo,
	} = await import('$/sources/Zcashd/JsonRpc/queries.ts')
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
	return {
		bestBlockHeight: BigInt(tipHeight),
		bestBlockHash,
		bestBlockTimeMs: tipBlock.time * 1000,
		blockCount: BigInt(tipHeight + 1),
		mempoolTransactionCount: mempoolInfo.size,
		mempoolSizeBytes: BigInt(mempoolInfo.bytes),
	}
}

const resolveNetworkTipTimestamps = async (network: NetworkSelector) => {
	const tip = await resolveNetworkTipObservation(network)
	return [
		{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: Date.now(),
				source: Source.Zcashd_JsonRpc,
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
	source: Source.Zcashd_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: zcashNetworkApplicability,
					resolve: async ({ $network, height }) => {
						assertZcashMainnet($network)
						const { getBlockHash } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
						return utxoBlockSnapshot(
							$network,
							await getBlockHash({
								height,
							})
						)
					},
				},
				NetworkHeightHash: {
					appliesTo: zcashNetworkApplicability,
					resolve: async ({ $network, hash }) => {
						assertZcashMainnet($network)
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
			$$transactions: {
				select: (snapshot) => snapshot.$$transactions,
				resolveCount: (snapshot) => snapshot.$$transactions.length,
			},
		}),

		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					appliesTo: zcashNetworkApplicability,
					resolve: ($block) => zcashPoolStateSnapshots(
						$block,
						Number($block.height)
					),
				},
				NetworkHeightHash: {
					appliesTo: zcashNetworkApplicability,
					resolve: ($block) => zcashPoolStateSnapshots(
						$block,
						$block.hash
					),
				},
			},
		})({
			$$zcashShieldedPoolStates: (states) => states.map((state) => ({
				[EntityMetaKey.Selector]: {
					$block: state.$block,
					$pool: state.$pool,
				},
				[EntityMetaKey.Fields]: {
					...(state.saplingTree != null && {
						[entityFieldAddressKey(EntityType.ZcashShieldedPoolBlockState, [], 'saplingTree')]: state.saplingTree,
					}),
					...(state.orchardTree != null && {
						[entityFieldAddressKey(EntityType.ZcashShieldedPoolBlockState, [], 'orchardTree')]: state.orchardTree,
					}),
				},
			})),
		}),

		defineResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: {
				NetworkTxId: {
					appliesTo: zcashNetworkApplicability,
					resolve: async (entitySelector) => {
						const transaction = await getTransaction(entitySelector)
						return {
							version: transaction.version,
							lockTime: transaction.locktime,
							sizeBytes: transaction.size,
							...(transaction.vsize != null && {
								virtualSizeBytes: transaction.vsize,
							}),
							isCoinbase: transaction.vin.some((input) => input.coinbase != null),
							$$inputs: transaction.vin.map((_input, indexInTransaction) => ({
								[EntityMetaKey.Selector]: {
									$transaction: entitySelector,
									indexInTransaction,
								},
							})),
							$$outputs: transaction.vout.map((_output, indexInTransaction) => ({
								[EntityMetaKey.Selector]: {
									$transaction: entitySelector,
									indexInTransaction,
								},
							})),
							$$shieldedActions: zcashShieldedActionSnapshots(
								entitySelector,
								transaction
							).map((action) => ({
								[EntityMetaKey.Selector]: {
									$transaction: action.$transaction,
									pool: action.pool,
									actionKind: action.actionKind,
									indexInTransaction: action.indexInTransaction,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], '$pool')]: action.$pool,
									[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'actionKind')]: action.actionKind,
									...('nullifier' in action && {
										[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'nullifier')]: action.nullifier,
									}),
									...('noteCommitment' in action && {
										[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'noteCommitment')]: action.noteCommitment,
									}),
									...('valueCommitment' in action && {
										[entityFieldAddressKey(EntityType.ZcashShieldedAction, [], 'valueCommitment')]: action.valueCommitment,
									}),
								},
							})),
						}
					},
				}
			},
		})({
			version: (snapshot) => snapshot.version,
			lockTime: (snapshot) => snapshot.lockTime,
			sizeBytes: (snapshot) => snapshot.sizeBytes,
			virtualSizeBytes: (snapshot) => snapshot.virtualSizeBytes,
			isCoinbase: (snapshot) => snapshot.isCoinbase,
			$$inputs: {
				select: (snapshot) => snapshot.$$inputs,
				resolveCount: (snapshot) => snapshot.$$inputs.length,
			},
			$$outputs: {
				select: (snapshot) => snapshot.$$outputs,
				resolveCount: (snapshot) => snapshot.$$outputs.length,
			},
			$$zcashShieldedActions: (snapshot) => snapshot.$$shieldedActions,
		}),

		defineResolver({
			entityType: EntityType.UtxoInput,
			resolve: {
				TransactionIndexInTransaction: {
					appliesTo: [
						{
							$transaction: {
								$network: zcashNetworkApplicability[0].$network,
							},
						},
						{
							$transaction: {
								$network: zcashNetworkApplicability[1].$network,
							},
						},
					],
					resolve: async ({ $transaction, indexInTransaction }) => {
						const input = (await getTransaction($transaction)).vin[indexInTransaction]
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
					appliesTo: [
						{
							$transaction: {
								$network: zcashNetworkApplicability[0].$network,
							},
						},
						{
							$transaction: {
								$network: zcashNetworkApplicability[1].$network,
							},
						},
					],
					resolve: async ({ $transaction, indexInTransaction }) => {
						const output = (await getTransaction($transaction)).vout[indexInTransaction]
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
		}),

		defineResolver({
			entityType: EntityType.UtxoAddress,
			resolve: {
				NetworkAddress: {
					appliesTo: zcashNetworkApplicability,
					resolve: async ({ $network, address }, context) => {
						assertZcashMainnet($network)
						const { getTransparentAddressUtxos } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
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
					appliesTo: zcashNetworkApplicability,
					resolve: async ({ $network, address: addressSelector }) => {
						assertZcashMainnet($network)
						const { getTransparentAddressUtxos } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
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
										source: Source.Zcashd_JsonRpc,
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
			resolve: {
				Caip2: {
					resolve: resolveUtxoBlocks,
				},
				Slug: {
					resolve: resolveUtxoBlocks,
				},
			},
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
						assertZcashMainnet(parentEntitySelector)
						let timeout: ReturnType<typeof setTimeout> | undefined
						let lastHeight: number | undefined
						const poll = async () => {
							try {
								if (signal.aborted)
									return
								const { getBlockCount } = await import('$/sources/Zcashd/JsonRpc/queries.ts')
								const tipHeight = await getBlockCount()
								if (lastHeight !== tipHeight) {
									lastHeight = tipHeight
									fields.$$blocks.invalidate()
								}
							} catch (error) {
								console.error('Zcashd_JsonRpc live UTXO head failed', error)
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
			resolve: {
				Caip2: {
					resolve: resolveNetworkTipTimestamps,
				},
				Slug: {
					resolve: resolveNetworkTipTimestamps,
				},
			},
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
						assertZcashMainnet(parentEntitySelector)
						let timeout: ReturnType<typeof setTimeout> | undefined
						const poll = async () => {
							try {
								if (signal.aborted)
									return
								const tip = await resolveNetworkTipObservation(parentEntitySelector)
								fields.$$timestamps.replaceRows([{
									source: Source.Zcashd_JsonRpc,
									value: [{
										[EntityMetaKey.Selector]: {
											$network: parentEntitySelector,
											timestampMs: Date.now(),
											source: Source.Zcashd_JsonRpc,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'ledgerModels')]: [NetworkLedgerModel.Utxo],
											[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'executionModels')]: [],
											[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: tip.bestBlockHeight,
											[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: tip.bestBlockHash,
											[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: tip.bestBlockTimeMs,
											[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'blockCount')]: tip.blockCount,
											[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: tip.mempoolTransactionCount,
											[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: tip.mempoolSizeBytes,
										},
									}],
								}])
							} catch (error) {
								console.error('Zcashd_JsonRpc live network head failed', error)
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
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: [
						{
							$network: {
								caip2: networkBySlug.zcash.caip2,
							},
							source: Source.Zcashd_JsonRpc,
						},
						{
							$network: {
								slug: networkBySlug.zcash.slug,
							},
							source: Source.Zcashd_JsonRpc,
						},
					],
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						if (source !== Source.Zcashd_JsonRpc)
							throw new Error(`Zcashd_JsonRpc: unsupported network timestamp source ${source}`)

						const tip = await resolveNetworkTipObservation($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							ledgerModels: [NetworkLedgerModel.Utxo],
							executionModels: [] satisfies NetworkExecutionModel[],
							...tip,
						}
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

		defineResolver({
			entityType: EntityType.ZcashShieldedAction,
			resolve: {
				TransactionPoolActionKindIndexInTransaction: {
					appliesTo: [
						{
							$transaction: {
								$network: zcashNetworkApplicability[0].$network,
							},
						},
						{
							$transaction: {
								$network: zcashNetworkApplicability[1].$network,
							},
						},
					],
					resolve: async ({ $transaction, pool, actionKind, indexInTransaction }) => {
						if (!validActionKindsByPool[pool].some((validActionKind) => validActionKind === actionKind))
							throw new Error(`Zcashd_JsonRpc: invalid ${pool}/${actionKind} shielded action`)

						const shieldedAction = zcashShieldedActionSnapshots(
							$transaction,
							await getTransaction($transaction)
						).find((action) => (
							action.pool === pool
							&& action.actionKind === actionKind
							&& action.indexInTransaction === indexInTransaction
						))
						if (shieldedAction == null) throw new Error(`Zcashd_JsonRpc: shielded action not found for ${$transaction.txId}`)
						return shieldedAction
					},
				}
			}
		})({
			$pool: (snapshot) => snapshot.$pool,
			actionKind: (snapshot) => snapshot.actionKind,
			nullifier: (snapshot) => snapshot.nullifier,
			noteCommitment: (snapshot) => snapshot.noteCommitment,
			valueCommitment: (snapshot) => snapshot.valueCommitment,
		}),

		defineResolver({
			entityType: EntityType.ZcashShieldedPoolBlockState,
			resolve: {
				BlockPool: {
					appliesTo: [
						{
							$block: {
								$network: zcashNetworkApplicability[0].$network,
							},
							$pool: {
								$network: zcashNetworkApplicability[0].$network,
							},
						},
						{
							$block: {
								$network: zcashNetworkApplicability[1].$network,
							},
							$pool: {
								$network: zcashNetworkApplicability[1].$network,
							},
						},
					],
					resolve: async ({ $block, $pool }) => {
						assertZcashMainnet($block.$network)
						assertZcashMainnet($pool.$network)
						const state = (await zcashPoolStateSnapshots(
							$block,
							'hash' in $block ? $block.hash : Number($block.height)
						))
							.find((state) => state.$pool.pool === $pool.pool)
						if (state == null)
							throw new Error(`Zcashd_JsonRpc: tree state is unsupported for ${$pool.pool}`)

						return state
					},
				},
			},
		})({
			saplingTree: (snapshot) => snapshot.saplingTree,
			orchardTree: (snapshot) => snapshot.orchardTree,
		}),
	],
}
