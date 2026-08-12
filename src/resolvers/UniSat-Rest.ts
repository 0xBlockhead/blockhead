import { networkBySlug } from '$/constants/Network.ts'
import {
	bitcoinOrdinalInscriptionRefsFromUtxoInscriptions,
	parseBitcoinInscriptionId,
} from '$/resolvers/bitcoinOrdinalsRunes.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { UniSatRuneBalance } from '$/sources/UniSat/Rest/types.ts'


const source = Source.UniSat_Rest
const bitcoin = networkBySlug.bitcoin

const assertBitcoinNetwork = (
	networkSelector: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (
		'caip2' in networkSelector ?
			(
				networkSelector.caip2.namespace !== bitcoin.caip2.namespace
				|| networkSelector.caip2.reference !== bitcoin.caip2.reference
			)
		:
			networkSelector.slug !== bitcoin.slug
	)
		throw new Error(`${source}: unsupported Bitcoin network`)
}

const networkFromOutput = (
	$output: EntitySelector<typeof schema, EntityType.UtxoOutput>
) => (
	$output.$transaction.$network
)

const bitcoinRuneBalanceReference = ({
	$address,
	$output,
	$network,
	row,
}: {
	$address?: EntitySelector<typeof schema, EntityType.UtxoAddress>
	$output?: EntitySelector<typeof schema, EntityType.UtxoOutput>
	$network: EntitySelector<typeof schema, EntityType.Network>
	row: UniSatRuneBalance
}) => ({
	[EntityMetaKey.Selector]: {
		...($address != null && { $address }),
		...($output != null && { $output }),
		$rune: {
			$network,
			runeId: row.runeid,
		},
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BitcoinRuneBalance, [], 'amount')]: row.amount,
		...(row.divisibility != null && {
			[entityFieldAddressKey(EntityType.BitcoinRuneBalance, [], 'divisibility')]: row.divisibility,
		}),
		...(row.symbol != null && {
			[entityFieldAddressKey(EntityType.BitcoinRuneBalance, [], 'symbol')]: row.symbol,
		}),
		[entityFieldAddressKey(EntityType.BitcoinRuneBalance, [], '$rune')]: {
			[EntityMetaKey.Selector]: {
				$network,
				runeId: row.runeid,
			},
			[EntityMetaKey.Fields]: {
				...(row.rune != null && {
					[entityFieldAddressKey(EntityType.BitcoinRune, [], 'rune')]: row.rune,
				}),
				...(row.spacedRune != null && {
					[entityFieldAddressKey(EntityType.BitcoinRune, [], 'spacedRune')]: row.spacedRune,
				}),
				...(row.divisibility != null && {
					[entityFieldAddressKey(EntityType.BitcoinRune, [], 'divisibility')]: row.divisibility,
				}),
				...(row.symbol != null && {
					[entityFieldAddressKey(EntityType.BitcoinRune, [], 'symbol')]: row.symbol,
				}),
			},
		},
	},
})

export default {
	source,

	resolvers: [
		defineResolver({
			entityType: EntityType.BitcoinOrdinalInscription,
			resolve: {
				NetworkInscriptionId: {
					resolve: async ({ $network, inscriptionId }, context) => {
						assertBitcoinNetwork($network)
						const { getInscriptionInfo } = await import('$/sources/UniSat/Rest/queries.ts')
						const info = await getInscriptionInfo(context.publicEnv, {
							inscriptionId,
						})
						const parsed = parseBitcoinInscriptionId(inscriptionId)
						const inscriptionIndex = (
							info.inscriptionIndex
							?? parsed?.inscriptionIndex
						)
						const revealTxId = parsed?.txId
						return {
							inscriptionId,
							...(inscriptionIndex != null && {
								inscriptionIndex,
							}),
							...(revealTxId != null && {
								$revealTransaction: {
									[EntityMetaKey.Selector]: {
										$network,
										txId: revealTxId,
									},
								},
							}),
							...(info.contentType != null && {
								contentType: info.contentType,
							}),
							...(info.contentLength != null && {
								contentLength: info.contentLength,
							}),
							...(info.contentBody != null && {
								contentBody: info.contentBody,
							}),
							...(info.inscriptionNumber != null && {
								inscriptionNumber: info.inscriptionNumber,
							}),
							...(info.height != null && {
								genesisHeight: info.height,
							}),
							...(info.timestamp != null && {
								genesisTimestampMs: info.timestamp * 1000,
							}),
							...(info.offset != null && {
								satOffset: info.offset,
							}),
							...(info.address != null && {
								$address: {
									[EntityMetaKey.Selector]: {
										$network,
										address: info.address,
									},
								},
							}),
							...(info.utxo != null && {
								$contentOutput: {
									[EntityMetaKey.Selector]: {
										$transaction: {
											$network,
											txId: info.utxo.txid,
										},
										indexInTransaction: info.utxo.vout,
									},
								},
							}),
						}
					},
				},
			},
		})({
			inscriptionIndex: (snapshot) => snapshot.inscriptionIndex,
			$revealTransaction: (snapshot) => snapshot.$revealTransaction,
			$contentOutput: (snapshot) => snapshot.$contentOutput,
			contentType: (snapshot) => snapshot.contentType,
			contentLength: (snapshot) => snapshot.contentLength,
			contentBody: (snapshot) => snapshot.contentBody,
			inscriptionNumber: (snapshot) => snapshot.inscriptionNumber,
			genesisHeight: (snapshot) => snapshot.genesisHeight,
			genesisTimestampMs: (snapshot) => snapshot.genesisTimestampMs,
			satOffset: (snapshot) => snapshot.satOffset,
			$address: (snapshot) => snapshot.$address,
		}),

		defineResolver({
			entityType: EntityType.BitcoinRune,
			resolve: {
				NetworkRuneId: {
					resolve: async ({ $network, runeId }, context) => {
						assertBitcoinNetwork($network)
						const { getRuneInfo } = await import('$/sources/UniSat/Rest/queries.ts')
						const info = await getRuneInfo(context.publicEnv, {
							runeId,
						})
						return {
							runeId: info.runeid,
							...(info.rune != null && {
								rune: info.rune,
							}),
							...(info.spacedRune != null && {
								spacedRune: info.spacedRune,
							}),
							...(info.number != null && {
								number: info.number,
							}),
							...(info.height != null && {
								etchingHeight: info.height,
							}),
							...(info.txidx != null && {
								etchingTxIndex: info.txidx,
							}),
							...(info.timestamp != null && {
								etchingTimestampMs: info.timestamp * 1000,
							}),
							...(info.divisibility != null && {
								divisibility: info.divisibility,
							}),
							...(info.symbol != null && {
								symbol: info.symbol,
							}),
							...(info.etching != null && {
								$etchingTransaction: {
									[EntityMetaKey.Selector]: {
										$network,
										txId: info.etching,
									},
								},
							}),
							...(info.premine != null && {
								premine: info.premine,
							}),
							...(info.mints != null && {
								mints: info.mints,
							}),
							...(info.burned != null && {
								burned: info.burned,
							}),
							...(info.supply != null && {
								supply: info.supply,
							}),
							...(info.holders != null && {
								holders: info.holders,
							}),
							...(info.transactions != null && {
								transactions: info.transactions,
							}),
							...(info.mintable != null && {
								mintable: info.mintable,
							}),
							...(info.remaining != null && {
								remaining: info.remaining,
							}),
							...(info.terms?.amount != null && {
								termsAmount: info.terms.amount,
							}),
							...(info.terms?.cap != null && {
								termsCap: info.terms.cap,
							}),
							...(info.terms?.heightStart != null && {
								termsHeightStart: info.terms.heightStart,
							}),
							...(info.terms?.heightEnd != null && {
								termsHeightEnd: info.terms.heightEnd,
							}),
							...(info.terms?.offsetStart != null && {
								termsOffsetStart: info.terms.offsetStart,
							}),
							...(info.terms?.offsetEnd != null && {
								termsOffsetEnd: info.terms.offsetEnd,
							}),
						}
					},
				},
			},
		})({
			rune: (snapshot) => snapshot.rune,
			spacedRune: (snapshot) => snapshot.spacedRune,
			number: (snapshot) => snapshot.number,
			symbol: (snapshot) => snapshot.symbol,
			divisibility: (snapshot) => snapshot.divisibility,
			etchingHeight: (snapshot) => snapshot.etchingHeight,
			etchingTxIndex: (snapshot) => snapshot.etchingTxIndex,
			etchingTimestampMs: (snapshot) => snapshot.etchingTimestampMs,
			$etchingTransaction: (snapshot) => snapshot.$etchingTransaction,
			premine: (snapshot) => snapshot.premine,
			supply: (snapshot) => snapshot.supply,
			mints: (snapshot) => snapshot.mints,
			burned: (snapshot) => snapshot.burned,
			holders: (snapshot) => snapshot.holders,
			transactions: (snapshot) => snapshot.transactions,
			mintable: (snapshot) => snapshot.mintable,
			remaining: (snapshot) => snapshot.remaining,
			termsAmount: (snapshot) => snapshot.termsAmount,
			termsCap: (snapshot) => snapshot.termsCap,
			termsHeightStart: (snapshot) => snapshot.termsHeightStart,
			termsHeightEnd: (snapshot) => snapshot.termsHeightEnd,
			termsOffsetStart: (snapshot) => snapshot.termsOffsetStart,
			termsOffsetEnd: (snapshot) => snapshot.termsOffsetEnd,
		}),

		defineResolver({
			entityType: EntityType.BitcoinRuneBalance,
			resolve: {
				UtxoOutputRune: {
					resolve: async ({ $output, $rune }, context) => {
						const $network = networkFromOutput($output)
						assertBitcoinNetwork($network)
						const { getUtxoRuneBalances } = await import('$/sources/UniSat/Rest/queries.ts')
						const balances = await getUtxoRuneBalances(context.publicEnv, {
							txId: $output.$transaction.txId,
							outputIndex: $output.indexInTransaction,
						})
						const balance = balances.find((row) => row.runeid === $rune.runeId)
						if (balance == null)
							throw new Error(`${source}: rune ${$rune.runeId} not on utxo`)

						return {
							amount: balance.amount,
							$rune: {
								[EntityMetaKey.Selector]: {
									$network,
									runeId: balance.runeid,
								},
							},
							$output: {
								[EntityMetaKey.Selector]: $output,
							},
							...(balance.divisibility != null && {
								divisibility: balance.divisibility,
							}),
							...(balance.symbol != null && {
								symbol: balance.symbol,
							}),
						}
					},
				},
				UtxoAddressRune: {
					resolve: async ({ $address, $rune }, context) => {
						assertBitcoinNetwork($address.$network)
						const { getAddressRuneBalance } = await import('$/sources/UniSat/Rest/queries.ts')
						const balance = await getAddressRuneBalance(context.publicEnv, {
							address: $address.address,
							runeId: $rune.runeId,
						})

						return {
							amount: balance.amount,
							$rune: {
								[EntityMetaKey.Selector]: {
									$network: $address.$network,
									runeId: balance.runeid,
								},
							},
							$address: {
								[EntityMetaKey.Selector]: $address,
							},
							...(balance.divisibility != null && {
								divisibility: balance.divisibility,
							}),
							...(balance.symbol != null && {
								symbol: balance.symbol,
							}),
						}
					},
				},
			},
		})({
			$rune: (snapshot) => snapshot.$rune,
			$output: (snapshot) => snapshot.$output,
			$address: (snapshot) => snapshot.$address,
			amount: (snapshot) => snapshot.amount,
			divisibility: (snapshot) => snapshot.divisibility,
			symbol: (snapshot) => snapshot.symbol,
		}),

		defineResolver({
			entityType: EntityType.UtxoAddress,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						assertBitcoinNetwork($network)
						const { getAddressInscriptions } = await import('$/sources/UniSat/Rest/queries.ts')
						const page = await getAddressInscriptions(context.publicEnv, {
							address,
							cursor: context.pagination.offset ?? 0,
							size: context.pagination.limit,
						})
						return {
							inscriptions: bitcoinOrdinalInscriptionRefsFromUtxoInscriptions(
								$network,
								page.detail
							),
							inscriptionCount: page.total,
						}
					},
				},
			},
		})({
			$$bitcoinOrdinalInscriptions: {
				select: (snapshot) => snapshot.inscriptions,
				resolveCount: (snapshot) => snapshot.inscriptionCount,
			},
		}),

		defineResolver({
			entityType: EntityType.UtxoAddress,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address }, context) => {
						assertBitcoinNetwork($network)
						const { getAddressRuneBalances } = await import('$/sources/UniSat/Rest/queries.ts')
						const page = await getAddressRuneBalances(context.publicEnv, {
							address,
							start: context.pagination.offset ?? 0,
							limit: context.pagination.limit,
						})
						return {
							runeBalances: page.detail.map((row) => bitcoinRuneBalanceReference({
								$address: {
									$network,
									address,
								},
								$network,
								row,
							})),
							runeBalanceCount: page.total,
						}
					},
				},
			},
		})({
			$$bitcoinRuneBalances: {
				select: (snapshot) => snapshot.runeBalances,
				resolveCount: (snapshot) => snapshot.runeBalanceCount,
			},
		}),

		defineResolver({
			entityType: EntityType.UtxoOutput,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }, context) => {
						assertBitcoinNetwork($transaction.$network)
						const { getUtxoInfo } = await import('$/sources/UniSat/Rest/queries.ts')
						const utxo = await getUtxoInfo(context.publicEnv, {
							txId: $transaction.txId,
							outputIndex: indexInTransaction,
						})
						const inscriptions = utxo?.inscriptions ?? []
						return {
							[EntityMetaKey.Selector]: {
								$transaction,
								indexInTransaction,
							},
							$$bitcoinOrdinalInscriptions: bitcoinOrdinalInscriptionRefsFromUtxoInscriptions(
								$transaction.$network,
								inscriptions
							),
							inscriptionCount: utxo?.inscriptionsCount ?? inscriptions.length,
							...(utxo?.satoshi != null && {
								valueSats: BigInt(utxo.satoshi),
							}),
							...(utxo?.scriptType != null && {
								scriptPubKeyType: utxo.scriptType,
							}),
							...(utxo?.scriptPk != null && {
								scriptPubKeyHex: utxo.scriptPk,
							}),
							...(utxo?.address != null && {
								$address: {
									[EntityMetaKey.Selector]: {
										$network: $transaction.$network,
										address: utxo.address,
									},
								},
							}),
							...(utxo?.isSpent != null && {
								isSpent: utxo.isSpent,
							}),
							...(utxo == null && {
								isSpent: true,
							}),
						}
					},
				},
			},
		})({
			valueSats: (snapshot) => snapshot.valueSats,
			scriptPubKeyType: (snapshot) => snapshot.scriptPubKeyType,
			scriptPubKeyHex: (snapshot) => snapshot.scriptPubKeyHex,
			$address: (snapshot) => snapshot.$address,
			isSpent: (snapshot) => snapshot.isSpent,
			$$bitcoinOrdinalInscriptions: {
				select: (snapshot) => snapshot.$$bitcoinOrdinalInscriptions,
				resolveCount: (snapshot) => snapshot.inscriptionCount,
			},
		}),

		defineResolver({
			entityType: EntityType.UtxoOutput,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }, context) => {
						assertBitcoinNetwork($transaction.$network)
						const { getUtxoRuneBalances } = await import('$/sources/UniSat/Rest/queries.ts')
						const balances = await getUtxoRuneBalances(context.publicEnv, {
							txId: $transaction.txId,
							outputIndex: indexInTransaction,
						})
						return {
							$$bitcoinRuneBalances: balances.map((row) => bitcoinRuneBalanceReference({
								$output: {
									$transaction,
									indexInTransaction,
								},
								$network: $transaction.$network,
								row,
							})),
							runeBalanceCount: balances.length,
						}
					},
				},
			},
		})({
			$$bitcoinRuneBalances: {
				select: (snapshot) => snapshot.$$bitcoinRuneBalances,
				resolveCount: (snapshot) => snapshot.runeBalanceCount,
			},
		}),
	],
}
