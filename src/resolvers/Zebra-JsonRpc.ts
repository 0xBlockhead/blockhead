import {
	defineResolver,
	type RegisteredSourceResolverModule,
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

const assertZcashMainnet = (network: NetworkId) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== networkBySlug.zcash.caip2.namespace
				|| network.caip2.reference !== networkBySlug.zcash.caip2.reference
			)
		:
			network.slug !== networkBySlug.zcash.slug
	)
		throw new Error('Zebra_JsonRpc: unsupported Zcash network')
}

const getTransaction = async ({ $network, txId }: {
	$network: NetworkId
	txId: string
}) => {
	assertZcashMainnet($network)
	const { getRawTransaction } = await import('$/sources/Zebra/JsonRpc/queries.ts')
	return getRawTransaction({
		txId,
	})
}

const utxoBlockSnapshot = async (
	$network: NetworkId,
	blockHash: string
) => {
	const { getBlock } = await import('$/sources/Zebra/JsonRpc/queries.ts')
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
	network: NetworkId,
	context: Parameters<typeof resolverContextRowLimit>[0]
) => {
	assertZcashMainnet(network)
	const {
		getBlockCount,
		getBlockHash,
	} = await import('$/sources/Zebra/JsonRpc/queries.ts')
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
	assertZcashMainnet(network)
	const {
		getBlock,
		getBlockCount,
		getBlockHash,
		getMempoolInfo,
	} = await import('$/sources/Zebra/JsonRpc/queries.ts')
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

const resolveNetworkTipTimestamps = async (network: NetworkId) => {
	const tip = await resolveNetworkTipObservation(network)
	return [
		{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: Date.now(),
				source: Source.Zebra_JsonRpc,
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
	source: Source.Zebra_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }) => {
						assertZcashMainnet($network)
						const { getBlockHash } = await import('$/sources/Zebra/JsonRpc/queries.ts')
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
			$$transactions: (snapshot) => snapshot.$$transactions,
		}),

		defineResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: {
				NetworkTxId: {
					resolve: async (entitySelector) => {
						const transaction = await getTransaction(entitySelector)
						return {
							version: transaction.version,
							lockTime: transaction.locktime,
							sizeBytes: transaction.size,
							...(transaction.vsize != null && {
								virtualSizeBytes: transaction.vsize,
							}),
							...(transaction.weight != null && {
								weightUnits: transaction.weight,
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
						}
					},
				}
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
					resolve: async ({ $network, address }, context) => {
						assertZcashMainnet($network)
						const { getTransparentAddressUtxos } = await import('$/sources/Zebra/JsonRpc/queries.ts')
						const { utxos } = await getTransparentAddressUtxos({
							address,
							maxResults: resolverContextRowLimit(context),
						})
						return utxos.map((utxo) => ({
							[EntityMetaKey.Selector]: {
								$transaction: {
									$network,
									txId: utxo.txid,
								},
								indexInTransaction: utxo.outputIndex,
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
						assertZcashMainnet($network)
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
										source: Source.Zebra_JsonRpc,
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
			entityType: EntityType.UtxoAddress_Timestamp,
			resolve: {
				AddressTimestampMsSource: {
					appliesTo: [
						{
							$address: {
								$network: {
									caip2: networkBySlug.zcash.caip2,
								},
							},
							source: Source.Zebra_JsonRpc,
						},
						{
							$address: {
								$network: {
									slug: networkBySlug.zcash.slug,
								},
							},
							source: Source.Zebra_JsonRpc,
						},
					],
					resolve: async ({ $address }) => {
						assertZcashMainnet($address.$network)
						const { getTransparentAddressUtxos } = await import('$/sources/Zebra/JsonRpc/queries.ts')
						const scan = await getTransparentAddressUtxos({
							address: $address.address,
							maxResults: 10_000,
						})
						return {
							balanceSats: BigInt(
								scan.utxos.reduce((total, utxo) => total + utxo.satoshis, 0)
							),
							unspentOutputCount: scan.utxos.length,
						}
					},
				},
			},
		})({
			balanceSats: (observation) => observation.balanceSats,
			unspentOutputCount: (observation) => observation.unspentOutputCount,
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
								const { getBlockCount } = await import('$/sources/Zebra/JsonRpc/queries.ts')
								const tipHeight = await getBlockCount()
								if (lastHeight !== tipHeight) {
									lastHeight = tipHeight
									fields.$$blocks.invalidate()
								}
							} catch (error) {
								console.error('Zebra_JsonRpc live UTXO head failed', error)
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
									source: Source.Zebra_JsonRpc,
									value: [{
										[EntityMetaKey.Selector]: {
											$network: parentEntitySelector,
											timestampMs: Date.now(),
											source: Source.Zebra_JsonRpc,
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
								console.error('Zebra_JsonRpc live network head failed', error)
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
							source: Source.Zebra_JsonRpc,
						},
						{
							$network: {
								slug: networkBySlug.zcash.slug,
							},
							source: Source.Zebra_JsonRpc,
						},
					],
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						if (source !== Source.Zebra_JsonRpc)
							throw new Error(`Zebra_JsonRpc: unsupported network timestamp source ${source}`)

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
	],
} satisfies RegisteredSourceResolverModule
