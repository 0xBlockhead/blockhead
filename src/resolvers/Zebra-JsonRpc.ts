import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import {
	zebraDefaultLocalRpcUrl,
	zcashMainnetCaip2,
} from '$/constants/BitcoinNetwork.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const assertZcashMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== zcashMainnetCaip2.namespace
		|| network.caip2.reference !== zcashMainnetCaip2.reference
	) {
		throw new Error('Zebra_JsonRpc: unsupported Zcash network')
	}
}

const valueSatsFromZec = (valueZec: number) => BigInt(Math.round(valueZec * 100_000_000))

const getTransaction = async (entityId: {
	$network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }
	txId: string
}) => {
	assertZcashMainnet(entityId.$network)
	const { getRawTransaction } = await import('$/sources/Zebra/JsonRpc/queries.ts')
	return getRawTransaction({
		rpcUrl: zebraDefaultLocalRpcUrl,
		txId: entityId.txId,
	})
}

export default {
	source: Source.Zebra_JsonRpc,

	resolvers: [
		defineResolver(Source.Zebra_JsonRpc, {
			entityType: EntityType.UtxoBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertZcashMainnet(entityId.$network)
				const {
					getBlock,
					getBlockHash,
				} = await import('$/sources/Zebra/JsonRpc/queries.ts')
				const block = await getBlock({
					rpcUrl: zebraDefaultLocalRpcUrl,
					blockHash: entityId.hash ?? await getBlockHash({
						rpcUrl: zebraDefaultLocalRpcUrl,
						height: entityId.height,
					}),
				})
				return {
					hash: block.hash,
					...(block.previousblockhash != null && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
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
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									txId: transaction,
								},
							}
						:
							{
								[EntityMetaKey.Id]: {
									$network: entityId.$network,
									txId: transaction.txid,
								},
								version: transaction.version,
								lockTime: transaction.locktime,
								sizeBytes: transaction.size,
								virtualSizeBytes: transaction.vsize,
								weightUnits: transaction.weight,
								isCoinbase: transaction.vin.some((input) => input.coinbase != null),
							}
					)),
				}
			}
			},
			fields: {
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
		}
		}),

		defineResolver(Source.Zebra_JsonRpc, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const transaction = await getTransaction(entityId)
				return {
					version: transaction.version,
					lockTime: transaction.locktime,
					sizeBytes: transaction.size,
					virtualSizeBytes: transaction.vsize,
					weightUnits: transaction.weight,
					isCoinbase: transaction.vin.some((input) => input.coinbase != null),
					$$inputs: transaction.vin.map((input, inputIndex) => (
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
					)),
					$$outputs: transaction.vout.map((output, outputIndex) => (
						{
							[EntityMetaKey.Id]: {
								$transaction: entityId,
								outputIndex,
							},
							valueSats: valueSatsFromZec(output.value),
							scriptPubKeyAsm: output.scriptPubKey.asm,
							scriptPubKeyHex: output.scriptPubKey.hex,
							scriptPubKeyType: output.scriptPubKey.type,
							...(output.scriptPubKey.address != null && {
								$address: {
									[EntityMetaKey.Id]: {
										$network: entityId.$network,
										address: output.scriptPubKey.address,
									},
								},
							}),
						}
					)),
				}
			}
			},
			fields: {
			version: (snapshot) => snapshot.version,
			lockTime: (snapshot) => snapshot.lockTime,
			sizeBytes: (snapshot) => snapshot.sizeBytes,
			virtualSizeBytes: (snapshot) => snapshot.virtualSizeBytes,
			weightUnits: (snapshot) => snapshot.weightUnits,
			isCoinbase: (snapshot) => snapshot.isCoinbase,
			$$inputs: (snapshot) => snapshot.$$inputs,
			$$outputs: (snapshot) => snapshot.$$outputs,
		}
		}),

		defineResolver(Source.Zebra_JsonRpc, {
			entityType: EntityType.UtxoInput,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			},
			fields: {
			$spentOutput: (snapshot) => snapshot.$spentOutput,
			coinbaseScript: (snapshot) => snapshot.coinbaseScript,
			scriptSigAsm: (snapshot) => snapshot.scriptSigAsm,
			sequence: (snapshot) => snapshot.sequence,
			witness: (snapshot) => snapshot.witness,
		}
		}),

		defineResolver(Source.Zebra_JsonRpc, {
			entityType: EntityType.UtxoOutput,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const output = (await getTransaction(entityId.$transaction)).vout[entityId.outputIndex]
				return {
					[EntityMetaKey.Id]: {
						$transaction: entityId.$transaction,
						outputIndex: entityId.outputIndex,
					},
					valueSats: valueSatsFromZec(output.value),
					scriptPubKeyAsm: output.scriptPubKey.asm,
					scriptPubKeyHex: output.scriptPubKey.hex,
					scriptPubKeyType: output.scriptPubKey.type,
					...(output.scriptPubKey.address != null && {
						$address: {
							[EntityMetaKey.Id]: {
								$network: entityId.$transaction.$network,
								address: output.scriptPubKey.address,
							},
						},
					}),
				}
			}
			},
			fields: {
			valueSats: (snapshot) => snapshot.valueSats,
			scriptPubKeyAsm: (snapshot) => snapshot.scriptPubKeyAsm,
			scriptPubKeyHex: (snapshot) => snapshot.scriptPubKeyHex,
			scriptPubKeyType: (snapshot) => snapshot.scriptPubKeyType,
			$address: (snapshot) => snapshot.$address,
		}
		}),
	],
}
