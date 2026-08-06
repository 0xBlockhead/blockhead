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

const bitcoinNetworkReferenceApplicability = [
	{
		$network: bitcoinNetworkApplicability[0],
	},
	{
		$network: bitcoinNetworkApplicability[1],
	},
] as const

const bitcoinAddressTimestampApplicability = [
	{
		$address: bitcoinNetworkReferenceApplicability[0],
		source: Source.Esplora_Rest,
	},
	{
		$address: bitcoinNetworkReferenceApplicability[1],
		source: Source.Esplora_Rest,
	},
] as const

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

const assertBitcoinMainnet = (network: NetworkId) => {
	if (esploraTargetForNetwork(network) !== 'bip122:000000000019d6689c085ae165831e93')
		throw new Error('Esplora_Rest: unsupported Bitcoin network')
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

const elementsAssetTimestampFieldsFromWire = (
	asset: EsploraAsset
) => ({
	...(asset.chain_stats.issued_amount != null && {
		issuedAmount: BigInt(asset.chain_stats.issued_amount),
	}),
	...(asset.chain_stats.burned_amount != null && {
		burnedAmount: BigInt(asset.chain_stats.burned_amount),
	}),
	...(asset.chain_stats.reissuance_tokens != null && {
		reissuanceTokenCount: asset.chain_stats.reissuance_tokens,
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

export default {
	source: Source.Esplora_Rest,

	resolvers: [
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
				NetworkHeightHash: {
					resolve: async ({ $network, hash }) => (
						(
							await (
								await import('$/sources/Esplora/Rest/queries.ts')
							).getBlockTransactionIds({
								blockHash: hash,
								target: esploraTargetForNetwork($network),
							})
						).map((txId) => ({
							[EntityMetaKey.Selector]: {
								$network,
								txId,
							},
						}))
					),
				}
			},
		})({
				$$transactions: (transactions) => transactions,
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
							$$bitcoinOrdinalInscriptions: bitcoinOrdinalInscriptionRefsFromPayloads($network, payloads),
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
						})).vin[indexInTransaction]
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
							...(input.scriptsig_asm != null && {
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
						const output = transaction.vout[indexInTransaction]
						const isConfidential = (
							output.valuecommitment != null
							|| output.assetcommitment != null
						)
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
						const payload = payloads[parsed.inscriptionIndex]
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
							!('slug' in $network)
							|| $network.slug !== 'liquid'
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
					resolve: async (entitySelector) => [
						{
							[EntityMetaKey.Selector]: {
								$asset: entitySelector,
								timestampMs: Date.now(),
								source: Source.Esplora_Rest,
							},
						},
					],
				},
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver({
			entityType: EntityType.ElementsAsset_Timestamp,
			resolve: {
				AssetTimestampMsSource: {
					resolve: async ({ $asset }) => {
						if (
							!('$network' in $asset)
							|| !('$network' in $asset.$network)
							|| !('slug' in $asset.$network.$network)
							|| $asset.$network.$network.slug !== 'liquid'
						)
							throw new Error('Esplora_Rest: unsupported Elements network')

						const { getAsset } = await import('$/sources/Esplora/Rest/queries.ts')
						const asset = await getAsset({
							assetId: $asset.assetId,
							target: 'liquid',
						})
						if (asset.asset_id !== $asset.assetId)
							throw new Error(`Esplora_Rest: asset id mismatch for ${$asset.assetId}`)

						return elementsAssetTimestampFieldsFromWire(asset)
					},
				},
			},
		})({
				issuedAmount: (snapshot) => snapshot.issuedAmount,
				burnedAmount: (snapshot) => snapshot.burnedAmount,
				reissuanceTokenCount: (snapshot) => snapshot.reissuanceTokenCount,
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
					appliesTo: bitcoinNetworkReferenceApplicability,
					resolve: async ({ $network, address: addressSelector }) => {
						assertBitcoinMainnet($network)
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
				select: (page, utxoAddress) => page.transactions.map((transaction) => ({
					[EntityMetaKey.Selector]: {
						$network: utxoAddress.$network,
						txId: transaction.txid,
					},
				})),
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
							}))
					},
				},
			},
		})({
			$$outputs: (outputs) => outputs,
		}),

		defineResolver({
			entityType: EntityType.UtxoAddress_Timestamp,
			resolve: {
				AddressTimestampMsSource: {
					appliesTo: bitcoinAddressTimestampApplicability,
					resolve: async ({ $address }) => {
						assertBitcoinMainnet($address.$network)
						const { getAddress } = await import('$/sources/Esplora/Rest/queries.ts')
						const address = await getAddress({
							address: $address.address,
							target: esploraTargetForNetwork($address.$network),
						})
						const chainStats = address.chain_stats
						return {
							balanceSats: BigInt(chainStats.funded_txo_sum - chainStats.spent_txo_sum),
							transactionCount: chainStats.tx_count,
							unspentOutputCount: chainStats.funded_txo_count - chainStats.spent_txo_count,
							fundedOutputCount: chainStats.funded_txo_count,
							spentOutputCount: chainStats.spent_txo_count,
							fundedValueSats: BigInt(chainStats.funded_txo_sum),
							spentValueSats: BigInt(chainStats.spent_txo_sum),
							mempoolTransactionCount: address.mempool_stats.tx_count,
						}
					},
				}
			},
		})({
			balanceSats: (address) => address.balanceSats,
			transactionCount: (address) => address.transactionCount,
			unspentOutputCount: (address) => address.unspentOutputCount,
			fundedOutputCount: (address) => address.fundedOutputCount,
			spentOutputCount: (address) => address.spentOutputCount,
			fundedValueSats: (address) => address.fundedValueSats,
			spentValueSats: (address) => address.spentValueSats,
			mempoolTransactionCount: (address) => address.mempoolTransactionCount,
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
			resolve: bitcoinNetworkSelectors(async (network) => {
				assertBitcoinMainnet(network)
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
			Utxo: {
				$$blocks: {
					select: () => [],
				},
				$$transactions: {
					select: () => [],
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: bitcoinNetworkSelectors(async (network, context) => {
				assertBitcoinMainnet(network)
				const { getBlocks } = await import('$/sources/Esplora/Rest/queries.ts')
				const blocks = await getBlocks({
					target: esploraTargetForNetwork(network),
				})
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
			resolve: bitcoinNetworkSelectors(async (network) => {
				assertBitcoinMainnet(network)
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
			resolve: bitcoinNetworkSelectors(async (network, context) => {
				assertBitcoinMainnet(network)
				const { getMempoolTransactionIds } = await import('$/sources/Esplora/Rest/queries.ts')
				const txids = await getMempoolTransactionIds(esploraTargetForNetwork(network))
				return txids.slice(0, resolverContextRowLimit(context)).map((txId) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						txId,
					},
				}))
			}),
		})({
			Utxo: {
				$$transactions: (transactions) => transactions,
			},
		}),

		defineResolver({
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: [
						{
							$network: bitcoinNetworkApplicability[0],
							source: Source.Esplora_Rest,
						},
						{
							$network: bitcoinNetworkApplicability[1],
							source: Source.Esplora_Rest,
						},
					],
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						if (source !== Source.Esplora_Rest)
							throw new Error(`Esplora_Rest: unsupported network timestamp source ${source}`)

						assertBitcoinMainnet($network)
						const target = esploraTargetForNetwork($network)
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
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							bestBlockHeight: BigInt(block.height),
							bestBlockHash: block.id,
							bestBlockTimeMs: block.timestamp * 1000,
							mempoolTransactionCount: mempoolStats.count,
							mempoolSizeBytes: BigInt(Math.ceil(mempoolStats.vsize)),
							suggestedTransactionFeePerByteSats: suggestedFee,
						}
					},
				},
			},
		})({
			$network: (timestamp) => timestamp.$network,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			Utxo: {
				bestBlockHeight: (timestamp) => timestamp.bestBlockHeight,
				bestBlockHash: (timestamp) => timestamp.bestBlockHash,
				bestBlockTimeMs: (timestamp) => timestamp.bestBlockTimeMs,
				mempoolTransactionCount: (timestamp) => timestamp.mempoolTransactionCount,
				mempoolSizeBytes: (timestamp) => timestamp.mempoolSizeBytes,
				suggestedTransactionFeePerByteSats: (timestamp) => timestamp.suggestedTransactionFeePerByteSats,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
