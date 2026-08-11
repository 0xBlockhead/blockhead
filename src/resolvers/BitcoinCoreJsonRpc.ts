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
	loadQueries,
	network,
	source,
}: {
	acceptsSlugSelector: boolean
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
			getBlock,
			getBlockCount,
			getBlockHash,
			getMempoolInfo,
		} = await loadQueries()
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

	const networkTimestampAppliesTo = [
		{
			$network: {
				caip2: network.caip2,
			},
			source,
		},
		...(
			acceptsSlugSelector ?
				[{
					$network: {
						slug: network.slug,
					},
					source,
				}]
			:
				[]
		),
	]

	return {
		source,

		resolvers: [
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
						resolve: async (entitySelector) => {
							const transaction = await getTransaction(entitySelector)
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
				version: (snapshot) => snapshot.version,
				lockTime: (snapshot) => snapshot.lockTime,
				sizeBytes: (snapshot) => snapshot.sizeBytes,
				virtualSizeBytes: (snapshot) => snapshot.virtualSizeBytes,
				weightUnits: (snapshot) => snapshot.weightUnits,
				isCoinbase: (snapshot) => snapshot.isCoinbase,
				$$inputs: (snapshot) => snapshot.$$inputs,
				$$outputs: (snapshot) => snapshot.$$outputs,
				$$bitcoinOrdinalInscriptions: (snapshot) => snapshot.$$bitcoinOrdinalInscriptions,
				$bitcoinRunestone: (snapshot) => snapshot.$bitcoinRunestone,
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
							const transaction = await getTransaction($transaction)
							const output = transaction.vout[indexInTransaction]
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
						resolve: async ({ $address }) => {
							assertNetwork($address.$network)
							const { getTransparentAddressUtxos } = await loadQueries()
							const scan = await getTransparentAddressUtxos({
								address: $address.address,
								maxResults: 10_000,
							})
							return {
								balanceSats: scan.totalAmountSatoshis,
								unspentOutputCount: scan.unspents.length,
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
				resolve: networkResolve,
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
			})({
				$$timestamps: (timestamps) => timestamps,
			}),

			defineResolver({
				entityType: EntityType.Network_Timestamp,
				resolve: {
					NetworkTimestampMsSource: {
						appliesTo: networkTimestampAppliesTo,
						resolve: async ({
							$network,
							timestampMs,
							source: timestampSource,
						}) => {
							if (timestampSource !== source)
								throw new Error(`${source}: unsupported network timestamp source ${timestampSource}`)

							const tip = await resolveNetworkTipObservation($network)
							return {
								$network: {
									[EntityMetaKey.Selector]: $network,
								},
								timestampMs,
								source: timestampSource,
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
	}
}
