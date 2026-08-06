import { networkBySlug } from '$/constants/Network.ts'
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
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { bitcoinCoreJsonRpc } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/queries.ts'

export const bitcoinCoreJsonRpcResolvers = <
	_Source extends
		| Source.BitcoinCore_JsonRpc
		| Source.LitecoinCore_JsonRpc
>({
	acceptsSlugSelector,
	loadQueries,
	network,
	source,
}: {
	acceptsSlugSelector: boolean
	loadQueries: () => Promise<ReturnType<typeof bitcoinCoreJsonRpc>>
	network: (typeof networkBySlug)['bitcoin' | 'litecoin']
	source: _Source
}) => {
	const assertNetwork = (
		networkSelector: EntitySelector<typeof schema, EntityType.Network>
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
		$network: EntitySelector<typeof schema, EntityType.Network>
		txId: string
	}) => {
		assertNetwork($network)
		const { getRawTransaction } = await loadQueries()
		return getRawTransaction({
			txId: txId,
		})
	}

	const getBitcoinProtocolPayloads = async ({ $network, txId }: {
		$network: EntitySelector<typeof schema, EntityType.Network>
		txId: string
	}) => {
		assertNetwork($network)
		if (source !== Source.BitcoinCore_JsonRpc)
			return []

		const { getTransactionProtocolPayloads } = await import('$/sources/BitcoinCore/JsonRpc/queries.ts')
		return getTransactionProtocolPayloads({
			txId,
		})
	}

	return {
		source,

		resolvers: [
			defineResolver({
				entityType: EntityType.UtxoBlock,
				resolve: {
					NetworkHeightHash: {
						resolve: async ({ $network, hash }) => {
							assertNetwork($network)
							const {
								getBlock,
							} = await loadQueries()
							const block = await getBlock({
								blockHash: hash,
							})
							return {
								hash: block.hash,
								...(block.previousblockhash != null && {
									$parent: {
										[EntityMetaKey.Selector]: {
											$network: $network,
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
						},
					}
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
							const payloads = await getBitcoinProtocolPayloads(entitySelector)
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
							const output = (await getTransaction($transaction)).vout[indexInTransaction]
							const payloads = await getBitcoinProtocolPayloads($transaction)
							const runestone = runestonePayload(payloads)
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

			...(source === Source.BitcoinCore_JsonRpc ?
				[
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
				]
			:
				[]
			),
		],
	}
}
