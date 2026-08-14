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
} from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ElementsPegDirection } from '$/schema/ElementsPegDirection.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { EsploraAsset } from '$/sources/Esplora/Rest/types.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const bitcoinNetworkApplicability = [
	{
		caip2: networkBySlug.bitcoin.caip2,
	},
	{
		slug: 'bitcoin',
	},
] as const

const liquidNetworkApplicability = {
	slug: 'liquid',
} as const

const esploraNetworkApplicability = [
	bitcoinNetworkApplicability[0],
	bitcoinNetworkApplicability[1],
	liquidNetworkApplicability,
] as const

const bitcoinNetworkReferenceApplicability = [
	{
		$network: bitcoinNetworkApplicability[0],
	},
	{
		$network: bitcoinNetworkApplicability[1],
	},
] as const

const esploraNetworkReferenceApplicability = [
	...bitcoinNetworkReferenceApplicability,
	{
		$network: liquidNetworkApplicability,
	},
] as const

const esploraNetworkSelectors = <_Snapshot extends object>(
	resolve: (
		network: NetworkId,
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Caip2: {
		appliesTo: [esploraNetworkApplicability[0]],
		resolve,
	},
	Slug: {
		appliesTo: [
			esploraNetworkApplicability[1],
			esploraNetworkApplicability[2],
		],
		resolve,
	},
})

const esploraTargetForNetwork = (network: NetworkId) => {
	const target = (
		'caip2' in network
		&& network.caip2.namespace === 'bip122'
		&& network.caip2.reference === '000000000019d6689c085ae165831e93' ?
			'bip122:000000000019d6689c085ae165831e93'
		: 'slug' in network && network.slug === 'bitcoin' ?
			'bip122:000000000019d6689c085ae165831e93'
		: 'slug' in network && network.slug === 'liquid' ?
			'liquid'
		:
			undefined
	)
	if (target == null)
		throw new Error('Esplora_Rest: unsupported network')

	return target
}

type EsploraTransaction = Awaited<ReturnType<
	typeof import('$/sources/Esplora/Rest/queries.ts').getTransaction
>>
type EsploraTransactionInput = EsploraTransaction['vin'][number]
type EsploraTransactionOutput = EsploraTransaction['vout'][number]

const esploraOutputIsConfidential = (
	output: {
		valuecommitment?: string
		assetcommitment?: string
	}
) => (
	output.valuecommitment != null
	|| output.assetcommitment != null
)

const utxoOutputConfidentialFieldEntries = (
	output: {
		valuecommitment?: string
		assetcommitment?: string
		noncecommitment?: string
		surjection_proof?: string
		range_proof?: string
	}
) => {
	if (!esploraOutputIsConfidential(output))
		return {}

	return {
		[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isConfidential')]: true,
		...(output.valuecommitment != null && {
			[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'valueCommitment')]: output.valuecommitment,
		}),
		...(output.assetcommitment != null && {
			[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'assetCommitment')]: output.assetcommitment,
		}),
		...(output.noncecommitment != null && {
			[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'nonceCommitment')]: output.noncecommitment,
		}),
		...(output.surjection_proof != null && {
			[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'surjectionProof')]: output.surjection_proof,
		}),
		...(output.range_proof != null && {
			[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'rangeProof')]: output.range_proof,
		}),
	}
}

const utxoInputReferenceFromEsploraWire = (
	$transaction: {
		$network: NetworkId
		txId: string
	},
	input: EsploraTransactionInput,
	indexInTransaction: number
) => ({
	[EntityMetaKey.Selector]: {
		$transaction,
		indexInTransaction,
	},
	[EntityMetaKey.Fields]: {
		...(input.txid != null && input.vout != null && {
			[entityFieldAddressKey(EntityType.UtxoInput, [], '$spentOutput')]: {
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
			[entityFieldAddressKey(EntityType.UtxoInput, [], 'coinbaseScript')]: input.scriptsig,
		}),
		...(!input.is_coinbase && input.scriptsig_asm != null && {
			[entityFieldAddressKey(EntityType.UtxoInput, [], 'scriptSigAsm')]: input.scriptsig_asm,
		}),
		...(input.sequence != null && {
			[entityFieldAddressKey(EntityType.UtxoInput, [], 'sequence')]: input.sequence,
		}),
		[entityFieldAddressKey(EntityType.UtxoInput, [], 'witness')]: input.witness ?? [],
	},
})

const utxoOutputReferenceFromEsploraWire = (
	$transaction: {
		$network: NetworkId
		txId: string
	},
	output: EsploraTransactionOutput,
	indexInTransaction: number
) => ({
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
					$network: $transaction.$network,
					address: output.scriptpubkey_address,
				},
			},
		}),
		...utxoOutputConfidentialFieldEntries(output),
	},
})

const utxoTransactionReferenceFromEsploraWire = (
	$network: NetworkId,
	transaction: EsploraTransaction
) => {
	const $transaction = {
		$network,
		txId: transaction.txid,
	}
	return {
		[EntityMetaKey.Selector]: $transaction,
		[EntityMetaKey.Fields]: {
			...(transaction.version != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'version')]: transaction.version,
			}),
			...(transaction.locktime != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'lockTime')]: transaction.locktime,
			}),
			...(transaction.size != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'sizeBytes')]: transaction.size,
			}),
			...(transaction.weight != null && {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'weightUnits')]: transaction.weight,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: Math.ceil(transaction.weight / 4),
			}),
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
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$inputs')]: transaction.vin.map((input, indexInTransaction) => (
				utxoInputReferenceFromEsploraWire($transaction, input, indexInTransaction)
			)),
			[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$outputs')]: transaction.vout.map((output, indexInTransaction) => (
				utxoOutputReferenceFromEsploraWire($transaction, output, indexInTransaction)
			)),
		},
	}
}

const utxoBlockTransactionPage = async (
	$network: NetworkId,
	hash: string,
	offset: number,
	limit: number
) => {
	const target = esploraTargetForNetwork($network)
	const {
		getBlock,
		getBlockTransactions,
	} = await import('$/sources/Esplora/Rest/queries.ts')
	const block = await getBlock({
		blockHash: hash,
		target,
	})
	const transactionCount = block.tx_count
	const transactions: EsploraTransaction[] = []
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
			throw new Error('Esplora_Rest: block transaction page ended before authoritative total')

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
		transactions: transactions.map((transaction) => utxoTransactionReferenceFromEsploraWire(
			$network,
			transaction
		)),
		transactionCount,
	}
}

const utxoBlockSnapshot = async (
	$network: NetworkId,
	hash: string
) => {
	const {
		getBlock,
	} = await import('$/sources/Esplora/Rest/queries.ts')
	const block = await getBlock({
		blockHash: hash,
		target: esploraTargetForNetwork($network),
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

const elementsAssetFieldsFromWire = (
	asset: EsploraAsset
) => ({
	...(asset.name != null && { name: asset.name }),
	...(asset.ticker != null && { ticker: asset.ticker }),
	...(asset.precision != null && { precision: asset.precision }),
	...(asset.entity?.domain != null && { entityDomain: asset.entity.domain }),
	...(asset.contract != null && { contractJson: JSON.stringify(asset.contract) }),
	...(asset.chain_stats.has_blinded_issuances != null && {
		hasBlindedIssuances: asset.chain_stats.has_blinded_issuances,
	}),
})

const elementsAssetReferenceFromWire = (
	asset: EsploraAsset
) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			$network: {
				slug: 'liquid',
			},
		},
		assetId: asset.asset_id,
	},
})

const assertLiquidElementsAssetSelector = (
	$network: EntitySelector<typeof schema, EntityType.ElementsNetwork>
) => {
	if (
		!('$network' in $network)
		|| !('slug' in $network.$network)
		|| $network.$network.slug !== 'liquid'
	)
		throw new Error('Esplora_Rest: unsupported Elements network')

	return $network.$network
}

const elementsIssuanceReferenceFromWire = (
	$network: NetworkId,
	assetId: string,
	transaction: EsploraTransaction,
	input: EsploraTransactionInput,
	inputIndex: number
) => {
	const issuance = input.issuance
	if (issuance == null || issuance.asset_id !== assetId)
		return

	return {
		[EntityMetaKey.Selector]: {
			$transaction: {
				$network,
				txId: transaction.txid,
			},
			inputIndex,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.ElementsIssuance, [], '$asset')]: {
				[EntityMetaKey.Selector]: {
					$network: {
						$network,
					},
					assetId: issuance.asset_id,
				},
			},
			...(issuance.token != null && {
				[entityFieldAddressKey(EntityType.ElementsIssuance, [], '$reissuanceTokenAsset')]: {
					[EntityMetaKey.Selector]: {
						$network: {
							$network,
						},
						assetId: issuance.token,
					},
				},
			}),
			[entityFieldAddressKey(EntityType.ElementsIssuance, [], 'assetEntropy')]: issuance.asset_entropy,
			[entityFieldAddressKey(EntityType.ElementsIssuance, [], 'assetBlindingNonce')]: issuance.asset_blinding_nonce,
			...(issuance.assetamount != null && {
				[entityFieldAddressKey(EntityType.ElementsIssuance, [], 'issuedAmount')]: BigInt(issuance.assetamount),
			}),
			...(issuance.tokenamount != null && {
				[entityFieldAddressKey(EntityType.ElementsIssuance, [], 'tokenAmount')]: BigInt(issuance.tokenamount),
			}),
			[entityFieldAddressKey(EntityType.ElementsIssuance, [], 'isReissuance')]: issuance.is_reissuance,
		},
	}
}

export default {
	source: Source.Esplora_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.ElementsPeg,
			resolve: {
				ElementsNetworkPegTransactionIdDirection: {
					resolve: async (selector) => {
						const transaction = await (await import('$/sources/Esplora/Rest/queries.ts')).getTransaction({
							target: esploraTargetForNetwork(selector.$network.$network),
							txId: selector.pegTransactionId,
						})
						const input = selector.direction === ElementsPegDirection.PegIn ? transaction.vin.filter((candidate) => candidate.is_pegin === true) : []
						const output = selector.direction === ElementsPegDirection.PegOut ? transaction.vout.filter((candidate) => candidate.pegout != null) : []
						if (input.length + output.length !== 1)
							throw new Error(`Esplora_Rest: expected one ${selector.direction} row, received ${String(input.length + output.length)}`)

						const amount = input[0]?.prevout?.value ?? output[0]?.value
						const timestampMs = transaction.status.block_time == null ? Date.now() : transaction.status.block_time * 1000
						return {
							$elementsTransaction: {
								[EntityMetaKey.Selector]: {
									$network: selector.$network.$network,
									txId: transaction.txid,
								},
							},
							...(input[0]?.txid != null && {
								$bitcoinTransaction: {
									[EntityMetaKey.Selector]: {
										$network: { slug: 'bitcoin' },
										txId: input[0].txid,
									},
								},
							}),
							...(amount != null && { amountSats: BigInt(amount) }),
							...(output[0]?.pegout?.scriptpubkey != null && { claimScript: output[0].pegout.scriptpubkey }),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$peg: selector,
									timestampMs,
									source: Source.Esplora_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.ElementsPeg_Timestamp, [], 'status')]: transaction.status.confirmed ? 'confirmed' : 'mempool',
									...(transaction.status.block_height != null && {
										[entityFieldAddressKey(EntityType.ElementsPeg_Timestamp, [], 'observedElementsHeight')]: BigInt(transaction.status.block_height),
									}),
								},
							}],
						}
					},
				},
			},
		})({
			$bitcoinTransaction: (snapshot) => snapshot.$bitcoinTransaction,
			$elementsTransaction: (snapshot) => snapshot.$elementsTransaction,
			amountSats: (snapshot) => snapshot.amountSats,
			claimScript: (snapshot) => snapshot.claimScript,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }) => (
						utxoBlockSnapshot(
							$network,
							await (
								await import('$/sources/Esplora/Rest/queries.ts')
							).getBlockHashByHeight({
								height,
								target: esploraTargetForNetwork($network),
							})
						)
					),
				},
				NetworkHeightHash: {
					resolve: async ({ $network, hash }) => (
						utxoBlockSnapshot($network, hash)
					),
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
			}),

		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }, context) => (
						utxoBlockTransactionPage(
							$network,
							await (
								await import('$/sources/Esplora/Rest/queries.ts')
							).getBlockHashByHeight({
								height,
								target: esploraTargetForNetwork($network),
							}),
							context.pagination.offset ?? 0,
							resolverContextRowLimit(context)
						)
					),
				},
				NetworkHeightHash: {
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

		defineResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: {
				NetworkTxId: {
					resolve: async (entitySelector) => {
						const {
							$network,
							txId,
						} = entitySelector
						const { getTransaction } = await import('$/sources/Esplora/Rest/queries.ts')
						const target = esploraTargetForNetwork($network)
						const transaction = await getTransaction({
							target,
							txId: txId,
						})
						const payloads = (
							target === 'bip122:000000000019d6689c085ae165831e93' ?
								(
									await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
								).extractEsploraProtocolPayloads(transaction)
							:
								[]
						)
						const $bitcoinRunestone = bitcoinRunestoneRefFromPayloads(entitySelector, payloads)
						const elementsPegDirections = target === 'liquid' ? [
							...(transaction.vin.filter((input) => input.is_pegin === true).length === 1 ? [ElementsPegDirection.PegIn] : []),
							...(transaction.vout.filter((output) => output.pegout != null).length === 1 ? [ElementsPegDirection.PegOut] : []),
						] : []
						return {
							...(transaction.status.block_height != null && transaction.status.block_hash != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										height: BigInt(transaction.status.block_height),
										hash: transaction.status.block_hash,
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
							$$inputs: transaction.vin.map((input, indexInTransaction) => (
								utxoInputReferenceFromEsploraWire(entitySelector, input, indexInTransaction)
							)),
							$$outputs: transaction.vout.map((output, indexInTransaction) => (
								utxoOutputReferenceFromEsploraWire(entitySelector, output, indexInTransaction)
							)),
							$$bitcoinOrdinalInscriptions: bitcoinOrdinalInscriptionRefsFromPayloads($network, payloads),
							$$elementsPegs: elementsPegDirections.map((direction) => ({
								[EntityMetaKey.Selector]: {
									$network: { $network },
									pegTransactionId: txId,
									direction,
								},
							})),
							...($bitcoinRunestone != null && {
								$bitcoinRunestone,
							}),
						}
					},
				}
			},
		})({
				$block: (snapshot) => snapshot.$block,
				version: (snapshot) => snapshot.version,
				lockTime: (snapshot) => snapshot.lockTime,
				sizeBytes: (snapshot) => snapshot.sizeBytes,
				weightUnits: (snapshot) => snapshot.weightUnits,
				virtualSizeBytes: (snapshot) => snapshot.virtualSizeBytes,
				feeSats: (snapshot) => snapshot.feeSats,
				isCoinbase: (snapshot) => snapshot.isCoinbase,
				$$inputs: (snapshot) => snapshot.$$inputs,
				$$outputs: (snapshot) => snapshot.$$outputs,
				$$bitcoinOrdinalInscriptions: (snapshot) => snapshot.$$bitcoinOrdinalInscriptions,
				$$elementsPegs: (snapshot) => snapshot.$$elementsPegs,
				$bitcoinRunestone: (snapshot) => snapshot.$bitcoinRunestone,
			}),

		defineResolver({
			entityType: EntityType.UtxoInput,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }) => {
						const { getTransaction } = await import('$/sources/Esplora/Rest/queries.ts')
						const input = (await getTransaction({
							target: esploraTargetForNetwork($transaction.$network),
							txId: $transaction.txId,
						})).vin.at(indexInTransaction)
						if (input == null)
							throw new Error(`Esplora_Rest: transaction input ${indexInTransaction} not found`)

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
						const { getTransaction } = await import('$/sources/Esplora/Rest/queries.ts')
						const target = esploraTargetForNetwork($transaction.$network)
						const transaction = await getTransaction({
							target,
							txId: $transaction.txId,
						})
						const output = transaction.vout.at(indexInTransaction)
						if (output == null)
							throw new Error(`Esplora_Rest: transaction output ${indexInTransaction} not found`)

						const isConfidential = esploraOutputIsConfidential(output)
						const runestone = (
							target === 'bip122:000000000019d6689c085ae165831e93' ?
								runestonePayload(
									(
										await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
									).extractEsploraProtocolPayloads(transaction)
								)
							:
								undefined
						)
						return {
							[EntityMetaKey.Selector]: {
								$transaction: $transaction,
								indexInTransaction: indexInTransaction,
							},
							...(output.value != null && {
								valueSats: BigInt(output.value),
							}),
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
							...(output.valuecommitment != null && {
								valueCommitment: output.valuecommitment,
							}),
							...(output.assetcommitment != null && {
								assetCommitment: output.assetcommitment,
							}),
							...(output.noncecommitment != null && {
								nonceCommitment: output.noncecommitment,
							}),
							...(output.surjection_proof != null && {
								surjectionProof: output.surjection_proof,
							}),
							...(output.range_proof != null && {
								rangeProof: output.range_proof,
							}),
							...(isConfidential && {
								isConfidential: true,
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
				isConfidential: (snapshot) => snapshot.isConfidential,
				$bitcoinRunestone: (snapshot) => snapshot.$bitcoinRunestone,
				Confidential: {
					valueCommitment: (snapshot) => snapshot.valueCommitment,
					assetCommitment: (snapshot) => snapshot.assetCommitment,
					nonceCommitment: (snapshot) => snapshot.nonceCommitment,
					surjectionProof: (snapshot) => snapshot.surjectionProof,
					rangeProof: (snapshot) => snapshot.rangeProof,
				},
		}),

		defineResolver({
			entityType: EntityType.UtxoOutput,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }) => {
						const { getOutspend } = await import('$/sources/Esplora/Rest/queries.ts')
						return {
							isSpent: (
								await getOutspend({
									target: esploraTargetForNetwork($transaction.$network),
									txId: $transaction.txId,
									vout: indexInTransaction,
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
			entityType: EntityType.ElementsIssuance,
			resolve: {
				UtxoTransactionInputIndex: {
					resolve: async ({ $transaction, inputIndex }) => {
						if (esploraTargetForNetwork($transaction.$network) !== 'liquid')
							throw new Error('Esplora_Rest: Elements issuance requires the Liquid network')

						const { getTransaction } = await import('$/sources/Esplora/Rest/queries.ts')
						const input = (await getTransaction({
							target: 'liquid',
							txId: $transaction.txId,
						})).vin.at(inputIndex)
						if (input == null)
							throw new Error(`Esplora_Rest: transaction input ${inputIndex} not found`)
						if (input.issuance == null)
							throw new Error(`Esplora_Rest: transaction input ${inputIndex} has no issuance`)

						return {
							$asset: {
								[EntityMetaKey.Selector]: {
									$network: {
										$network: $transaction.$network,
									},
									assetId: input.issuance.asset_id,
								},
							},
							...(input.issuance.token != null && {
								$reissuanceTokenAsset: {
									[EntityMetaKey.Selector]: {
										$network: {
											$network: $transaction.$network,
										},
										assetId: input.issuance.token,
									},
								},
							}),
							assetEntropy: input.issuance.asset_entropy,
							assetBlindingNonce: input.issuance.asset_blinding_nonce,
							...(input.issuance.assetamount != null && {
								issuedAmount: BigInt(input.issuance.assetamount),
							}),
							...(input.issuance.tokenamount != null && {
								tokenAmount: BigInt(input.issuance.tokenamount),
							}),
							isReissuance: input.issuance.is_reissuance,
						}
					},
				},
			},
		})({
			$asset: (issuance) => issuance.$asset,
			$reissuanceTokenAsset: (issuance) => issuance.$reissuanceTokenAsset,
			assetEntropy: (issuance) => issuance.assetEntropy,
			assetBlindingNonce: (issuance) => issuance.assetBlindingNonce,
			issuedAmount: (issuance) => issuance.issuedAmount,
			tokenAmount: (issuance) => issuance.tokenAmount,
			isReissuance: (issuance) => issuance.isReissuance,
		}),

		defineResolver({
			entityType: EntityType.BitcoinOrdinalInscription,
			resolve: {
				NetworkInscriptionId: {
					resolve: async ({ $network, inscriptionId }) => {
						const target = esploraTargetForNetwork($network)
						if (target !== 'bip122:000000000019d6689c085ae165831e93')
							throw new Error('Esplora_Rest: Ordinals only on Bitcoin mainnet')

						const parsed = parseBitcoinInscriptionId(inscriptionId)
						if (parsed == null)
							throw new Error(`Esplora_Rest: invalid inscription id ${inscriptionId}`)

						const { getTransactionProtocolPayloads } = await import('$/sources/Esplora/Rest/queries.ts')
						const payloads = ordinalsPayloads(
							await getTransactionProtocolPayloads({
								target,
								txId: parsed.txId,
							})
						)
						const payload = payloads.at(parsed.inscriptionIndex)
						if (payload == null)
							throw new Error(`Esplora_Rest: inscription ${inscriptionId} not found in reveal transaction`)

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
						const target = esploraTargetForNetwork($transaction.$network)
						if (target !== 'bip122:000000000019d6689c085ae165831e93')
							throw new Error('Esplora_Rest: Runes only on Bitcoin mainnet')

						const { getTransactionProtocolPayloads } = await import('$/sources/Esplora/Rest/queries.ts')
						const runestone = runestonePayload(
							await getTransactionProtocolPayloads({
								target,
								txId: $transaction.txId,
							})
						)
						if (runestone == null || runestone.location.outputIndex !== outputIndex)
							throw new Error(`Esplora_Rest: runestone not found at output ${outputIndex}`)

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
			entityType: EntityType.ElementsAsset,
			resolve: {
				ElementsNetworkAssetId: {
					resolve: async ({ $network, assetId }) => {
						if (
							!('$network' in $network)
							|| !('slug' in $network.$network)
							|| $network.$network.slug !== 'liquid'
						)
						throw new Error('Esplora_Rest: unsupported Elements network')

						const { getAsset } = await import('$/sources/Esplora/Rest/queries.ts')
						const asset = await getAsset({
							assetId: assetId,
							target: 'liquid',
						})
						if (asset.asset_id !== assetId)
							throw new Error(`Esplora_Rest: asset id mismatch for ${assetId}`)

						return elementsAssetFieldsFromWire(asset)
					},
				}
			},
		})({
				name: (snapshot) => snapshot.name,
				ticker: (snapshot) => snapshot.ticker,
				precision: (snapshot) => snapshot.precision,
				entityDomain: (snapshot) => snapshot.entityDomain,
				contractJson: (snapshot) => snapshot.contractJson,
				hasBlindedIssuances: (snapshot) => snapshot.hasBlindedIssuances,
			}),

		defineResolver({
			entityType: EntityType.ElementsAsset,
			resolve: {
				ElementsNetworkAssetId: {
					resolve: async (entitySelector) => {
						if (
							!('$network' in entitySelector.$network)
							|| !('slug' in entitySelector.$network.$network)
							|| entitySelector.$network.$network.slug !== 'liquid'
						)
							throw new Error('Esplora_Rest: unsupported Elements network')

						const { getAsset } = await import('$/sources/Esplora/Rest/queries.ts')
						const asset = await getAsset({
							assetId: entitySelector.assetId,
							target: 'liquid',
						})
						if (asset.asset_id !== entitySelector.assetId)
							throw new Error(`Esplora_Rest: asset id mismatch for ${entitySelector.assetId}`)

						return [{
							[EntityMetaKey.Selector]: {
								$asset: entitySelector,
								timestampMs: Date.now(),
								source: Source.Esplora_Rest,
							},
							[EntityMetaKey.Fields]: {
								...(asset.chain_stats.issued_amount != null && {
									[entityFieldAddressKey(EntityType.ElementsAsset_Timestamp, [], 'issuedAmount')]: BigInt(asset.chain_stats.issued_amount),
								}),
								...(asset.chain_stats.burned_amount != null && {
									[entityFieldAddressKey(EntityType.ElementsAsset_Timestamp, [], 'burnedAmount')]: BigInt(asset.chain_stats.burned_amount),
								}),
								...(asset.chain_stats.reissuance_tokens != null && {
									[entityFieldAddressKey(EntityType.ElementsAsset_Timestamp, [], 'reissuanceTokenCount')]: asset.chain_stats.reissuance_tokens,
								}),
							},
						}]
					},
				},
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver({
			entityType: EntityType.ElementsAsset,
			resolve: {
				ElementsNetworkAssetId: {
					resolve: async (entitySelector, context) => {
						const $network = assertLiquidElementsAssetSelector(entitySelector.$network)
						const limit = Math.min(resolverContextRowLimit(context), 25)
						if (!Number.isSafeInteger(limit) || limit < 1)
							throw new Error('Esplora_Rest: invalid asset issuance limit')

						const { getAssetTransactions } = await import('$/sources/Esplora/Rest/queries.ts')
						const transactions = await getAssetTransactions({
							assetId: entitySelector.assetId,
							lastSeenTransactionId: context.providerContinuationToken,
							target: 'liquid',
						})

						return {
							$network,
							assetId: entitySelector.assetId,
							terminal: transactions.length < 25 && transactions.length <= limit,
							transactions: transactions.slice(0, limit),
						}
					},
				},
			},
		})({
			$$issuances: {
				select: (page) => page.transactions.flatMap((transaction) => (
					transaction.vin.flatMap((input, inputIndex) => {
						const issuance = elementsIssuanceReferenceFromWire(
							page.$network,
							page.assetId,
							transaction,
							input,
							inputIndex
						)
						return issuance == null ? [] : [issuance]
					})
				)),
				continuation: (page) => {
					const lastTransaction = page.transactions.at(-1)
					return (
						page.terminal || lastTransaction == null ?
							{
								operation: 'asset-issuances',
								target: page.assetId,
								terminal: true,
							}
						:
							{
								operation: 'asset-issuances',
								target: page.assetId,
								terminal: false,
								token: lastTransaction.txid,
							}
					)
				},
			},
		}),

		defineResolver({
			entityType: EntityType.ElementsAsset,
			resolve: {
				ElementsNetworkAssetId: {
					resolve: async (entitySelector) => {
						assertLiquidElementsAssetSelector(entitySelector.$network)
						const { getAsset } = await import('$/sources/Esplora/Rest/queries.ts')
						const asset = await getAsset({
							assetId: entitySelector.assetId,
							target: 'liquid',
						})
						if (asset.asset_id !== entitySelector.assetId)
							throw new Error(`Esplora_Rest: asset id mismatch for ${entitySelector.assetId}`)
						if (asset.chain_stats.issuance_count == null)
							throw new Error(`Esplora_Rest: asset ${entitySelector.assetId} is missing issuance_count`)

						return asset.chain_stats.issuance_count
					},
				},
			},
		})({
			$$issuances: {
				resolveCount: (issuanceCount) => issuanceCount,
			},
		}),

		defineResolver({
			entityType: EntityType.ElementsNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						if (
							!('slug' in $network)
							|| $network.slug !== 'liquid'
						)
							throw new Error('Esplora_Rest: unsupported Elements network')

						const { getAsset } = await import('$/sources/Esplora/Rest/queries.ts')
						const asset = await getAsset({
							assetId: '6f0279e9ed041c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d',
							target: 'liquid',
						})

						return elementsAssetReferenceFromWire(asset)
					},
				}
			},
		})({
			$nativeAsset: (assetReference) => assetReference,
		}),

		defineResolver({
			entityType: EntityType.ElementsNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						if (
							!('slug' in $network)
							|| $network.slug !== 'liquid'
						)
							throw new Error('Esplora_Rest: unsupported Elements network')

						const { listRegistryAssets } = await import('$/sources/Esplora/Rest/queries.ts')
						return (await listRegistryAssets({
							target: 'liquid',
						}))
							.slice(0, resolverContextRowLimit(context))
							.map(elementsAssetReferenceFromWire)
					},
				}
			},
		})({
			$$assets: (assetReferences) => assetReferences,
		}),

		defineResolver({
			entityType: EntityType.UtxoAddress,
			resolve: {
				NetworkAddress: {
					appliesTo: esploraNetworkReferenceApplicability,
					resolve: async ({ $network, address: addressSelector }) => {
						const { getAddress } = await import('$/sources/Esplora/Rest/queries.ts')
						const address = await getAddress({
							address: addressSelector,
							target: esploraTargetForNetwork($network),
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
										source: Source.Esplora_Rest,
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
					appliesTo: esploraNetworkReferenceApplicability,
					resolve: async (utxoAddress, context) => {
						const limit = Math.min(resolverContextRowLimit(context), 25)
						if (!Number.isSafeInteger(limit) || limit < 1)
							throw new Error('Esplora_Rest: invalid address transaction limit')

						const { getAddressTransactions } = await import('$/sources/Esplora/Rest/queries.ts')
						const transactions = await getAddressTransactions({
							address: utxoAddress.address,
							lastSeenTransactionId: context.providerContinuationToken,
							target: esploraTargetForNetwork(utxoAddress.$network),
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
					utxoTransactionReferenceFromEsploraWire(
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
					appliesTo: esploraNetworkReferenceApplicability,
					resolve: async ({ $network, address }, context) => {
						const { getAddressUtxos } = await import('$/sources/Esplora/Rest/queries.ts')
						return (
							await getAddressUtxos({
								address,
								target: esploraTargetForNetwork($network),
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
									...(utxo.value != null && {
										[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: BigInt(utxo.value),
									}),
									[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: false,
									...utxoOutputConfidentialFieldEntries(utxo),
								},
							}))
					},
				},
			},
		})({
			$$outputs: (outputs) => outputs,
		}),
		defineResolver({
			entityType: EntityType.Network,
			resolve: esploraNetworkSelectors(async (network) => ({
				[EntityMetaKey.Selector]: network,
				slug: esploraTargetForNetwork(network) === 'liquid' ? 'liquid' : 'bitcoin',
			})),
		})({
			slug: (network) => network.slug,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: esploraNetworkSelectors(async (network) => {
				const target = esploraTargetForNetwork(network)
				const {
					getBlocks,
					getMempoolStats,
					getSuggestedFeePerByteSats,
				} = await import('$/sources/Esplora/Rest/queries.ts')
				const [blocks, mempoolStats, suggestedFee] = await Promise.all([
					getBlocks({ target }),
					getMempoolStats(target),
					getSuggestedFeePerByteSats(target),
				])
				const block = blocks.at(0)
				if (block == null) throw new Error('Esplora_Rest: no blocks returned')
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: network,
							timestampMs: Date.now(),
							source: Source.Esplora_Rest,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: BigInt(block.height),
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: block.id,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: block.timestamp * 1000,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: mempoolStats.count,
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolSizeBytes')]: BigInt(Math.ceil(mempoolStats.vsize)),
							[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'suggestedTransactionFeePerByteSats')]: suggestedFee,
						},
					},
				]
			}),
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: esploraNetworkSelectors(async (network, context) => {
				const { getBlocks } = await import('$/sources/Esplora/Rest/queries.ts')
				const target = esploraTargetForNetwork(network)
				const tipBlocks = await getBlocks({ target })
				const offset = context.pagination.offset ?? 0
				const tip = tipBlocks.at(0)
				if (tip == null)
					throw new Error('Esplora_Rest: no blocks returned')

				if (BigInt(offset) > BigInt(tip.height))
					return []

				const blocks = (
					offset === 0 ?
						tipBlocks
					:
						await getBlocks({
							startHeight: BigInt(tip.height) - BigInt(offset),
							target,
						})
				)
				return blocks.slice(0, resolverContextRowLimit(context)).map((block) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						height: BigInt(block.height),
						hash: block.id,
					},
				}))
			}),
		})({
			Utxo: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: esploraNetworkSelectors(async (network) => {
				const target = esploraTargetForNetwork(network)
				const {
					getBlocks,
					getMempoolStats,
				} = await import('$/sources/Esplora/Rest/queries.ts')
				const [blocks, mempoolStats] = await Promise.all([
					getBlocks({ target }),
					getMempoolStats(target),
				])
				const latestBlock = blocks.at(0)
				if (latestBlock == null)
					throw new Error('Esplora_Rest: no blocks returned for counts')

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
			resolve: esploraNetworkSelectors(async (network, context) => {
				const {
					getMempoolTransactionIds,
					getTransaction,
				} = await import('$/sources/Esplora/Rest/queries.ts')
				const target = esploraTargetForNetwork(network)
				const txids = await getMempoolTransactionIds(target)
				return Promise.all(
					txids
						.slice(
							context.pagination.offset ?? 0,
							(context.pagination.offset ?? 0) + resolverContextRowLimit(context)
						)
						.map(async (txId) => utxoTransactionReferenceFromEsploraWire(
							network,
							await getTransaction({
								target,
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

	],
} satisfies RegisteredSourceResolverModule
