import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	StellarHorizonAssetIdentity,
	StellarHorizonBalance,
	StellarHorizonOffer,
	StellarHorizonTrade,
	StellarHorizonTransaction,
} from '$/sources/StellarHorizon/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const assertStellarPublicNetwork = ($network: {
	$network: {
		slug: string
	}
}) => {
	if ($network.$network.slug !== networkBySlug.stellar.slug)
		throw new Error('StellarHorizon_Rest: unsupported network')
}

const timestampMsFromWire = (
	value: string,
	label: string
) => {
	const timestampMs = Date.parse(value)
	if (!Number.isSafeInteger(timestampMs))
		throw new Error(`StellarHorizon_Rest: invalid ${label}`)

	return timestampMs
}

const assetKeyFromIdentity = (
	asset: StellarHorizonAssetIdentity | Pick<
		StellarHorizonBalance,
		'asset_type' | 'asset_code' | 'asset_issuer'
	>
) => {
	if (asset.asset_type === 'native')
		return 'XLM'
	if (
		asset.asset_type === 'liquidity_pool_shares'
		|| asset.asset_code == null
		|| asset.asset_issuer == null
	)
		throw new Error('StellarHorizon_Rest: issued asset identity required')

	return `${asset.asset_code}-${asset.asset_issuer}`
}

const assetSelector = (
	$network: {
		$network: {
			slug: string
		}
	},
	asset: StellarHorizonAssetIdentity | Pick<
		StellarHorizonBalance,
		'asset_type' | 'asset_code' | 'asset_issuer'
	>
) => ({
	$network,
	assetKey: assetKeyFromIdentity(asset),
})

const assetFields = (
	asset: StellarHorizonAssetIdentity | Pick<
		StellarHorizonBalance,
		'asset_type' | 'asset_code' | 'asset_issuer'
	>
) => {
	if (asset.asset_type === 'native')
		return {
			[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetKind')]: 'native',
			[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetCode')]: 'XLM',
		}

	return {
		[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetKind')]: asset.asset_type,
		[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetCode')]: asset.asset_code,
		[entityFieldAddressKey(EntityType.StellarAsset, [], 'issuer')]: asset.asset_issuer,
	}
}

const tradeAssetSelector = (
	$network: {
		$network: {
			slug: string
		}
	},
	assetType: StellarHorizonTrade['base_asset_type'],
	assetCode: string | undefined,
	assetIssuer: string | undefined
) => (
	assetSelector($network, {
		asset_type: assetType,
		asset_code: assetCode,
		asset_issuer: assetIssuer,
	})
)

const accountContinuation = (
	operation: string,
	accountId: string,
	limit: number,
	records: {
		paging_token: string
	}[]
) => {
	const nextCursor = records.at(-1)?.paging_token

	return nextCursor == null || records.length < limit ?
		{
			operation,
			target: accountId,
			terminal: true,
		}
	:
		{
			operation,
			target: accountId,
			terminal: false,
			token: nextCursor,
		}
}

const transactionTimestampFields = (
	transaction: StellarHorizonTransaction,
	transactionSelector: {
		$network: {
			$network: {
				slug: string
			}
		}
		hash: string
	}
) => {
	const timestampMs = timestampMsFromWire(transaction.created_at, 'transaction creation time')

	return {
		[EntityMetaKey.Selector]: {
			$transaction: transactionSelector,
			timestampMs,
			source: Source.StellarHorizon_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'ledgerSequence')]: BigInt(transaction.ledger),
			[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'successful')]: transaction.successful,
			[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'feeCharged')]: BigInt(transaction.fee_charged),
			[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'maxFee')]: BigInt(transaction.max_fee),
			...(transaction.memo_type !== 'none' && {
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'memo')]: {
					type: transaction.memo_type,
					...(transaction.memo != null && {
						value: transaction.memo,
					}),
				},
			}),
		},
	}
}

const offerFromWire = (
	$network: {
		$network: {
			slug: string
		}
	},
	offer: StellarHorizonOffer
) => {
	const offerSelector = {
		$network,
		offerId: offer.id,
	}
	const timestampMs = (
		offer.last_modified_time == null ?
			undefined
		:
			timestampMsFromWire(offer.last_modified_time, 'offer modification time')
	)

	return {
		[EntityMetaKey.Selector]: offerSelector,
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.StellarOffer, [], '$seller')]: {
				[EntityMetaKey.Selector]: {
					$network,
					accountId: offer.seller,
				},
			},
			[entityFieldAddressKey(EntityType.StellarOffer, [], '$sellingAsset')]: {
				[EntityMetaKey.Selector]: assetSelector($network, offer.selling),
				[EntityMetaKey.Fields]: assetFields(offer.selling),
			},
			[entityFieldAddressKey(EntityType.StellarOffer, [], '$buyingAsset')]: {
				[EntityMetaKey.Selector]: assetSelector($network, offer.buying),
				[EntityMetaKey.Fields]: assetFields(offer.buying),
			},
			...(timestampMs != null && {
				[entityFieldAddressKey(EntityType.StellarOffer, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$offer: offerSelector,
						timestampMs,
						source: Source.StellarHorizon_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.StellarOffer_Timestamp, [], 'ledgerSequence')]: BigInt(offer.last_modified_ledger),
						[entityFieldAddressKey(EntityType.StellarOffer_Timestamp, [], 'amount')]: offer.amount,
						[entityFieldAddressKey(EntityType.StellarOffer_Timestamp, [], 'price')]: offer.price,
						[entityFieldAddressKey(EntityType.StellarOffer_Timestamp, [], 'priceNumerator')]: BigInt(offer.price_r.n),
						[entityFieldAddressKey(EntityType.StellarOffer_Timestamp, [], 'priceDenominator')]: BigInt(offer.price_r.d),
						[entityFieldAddressKey(EntityType.StellarOffer_Timestamp, [], 'active')]: true,
						[entityFieldAddressKey(EntityType.StellarOffer_Timestamp, [], 'lastModifiedTimeMs')]: timestampMs,
						...(offer.sponsor != null && {
							[entityFieldAddressKey(EntityType.StellarOffer_Timestamp, [], 'sponsor')]: offer.sponsor,
						}),
					},
				}],
			}),
		},
	}
}

const tradeFromWire = (
	$network: {
		$network: {
			slug: string
		}
	},
	trade: StellarHorizonTrade
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		tradeId: trade.id,
		source: Source.StellarHorizon_Rest,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.StellarTrade, [], 'ledgerCloseTimeMs')]: timestampMsFromWire(trade.ledger_close_time, 'trade ledger close time'),
		[entityFieldAddressKey(EntityType.StellarTrade, [], 'baseAmount')]: trade.base_amount,
		[entityFieldAddressKey(EntityType.StellarTrade, [], 'counterAmount')]: trade.counter_amount,
		[entityFieldAddressKey(EntityType.StellarTrade, [], 'priceNumerator')]: BigInt(trade.price.n),
		[entityFieldAddressKey(EntityType.StellarTrade, [], 'priceDenominator')]: BigInt(trade.price.d),
		[entityFieldAddressKey(EntityType.StellarTrade, [], '$baseAsset')]: {
			[EntityMetaKey.Selector]: tradeAssetSelector(
				$network,
				trade.base_asset_type,
				trade.base_asset_code,
				trade.base_asset_issuer
			),
		},
		[entityFieldAddressKey(EntityType.StellarTrade, [], '$counterAsset')]: {
			[EntityMetaKey.Selector]: tradeAssetSelector(
				$network,
				trade.counter_asset_type,
				trade.counter_asset_code,
				trade.counter_asset_issuer
			),
		},
		...(trade.base_account != null && {
			[entityFieldAddressKey(EntityType.StellarTrade, [], '$baseAccount')]: {
				[EntityMetaKey.Selector]: {
					$network,
					accountId: trade.base_account,
				},
			},
		}),
		...(trade.counter_account != null && {
			[entityFieldAddressKey(EntityType.StellarTrade, [], '$counterAccount')]: {
				[EntityMetaKey.Selector]: {
					$network,
					accountId: trade.counter_account,
				},
			},
		}),
		...(trade.base_offer_id != null && {
			[entityFieldAddressKey(EntityType.StellarTrade, [], '$baseOffer')]: {
				[EntityMetaKey.Selector]: {
					$network,
					offerId: trade.base_offer_id,
				},
			},
		}),
		...(trade.counter_offer_id != null && {
			[entityFieldAddressKey(EntityType.StellarTrade, [], '$counterOffer')]: {
				[EntityMetaKey.Selector]: {
					$network,
					offerId: trade.counter_offer_id,
				},
			},
		}),
		...(trade.base_liquidity_pool_id != null && {
			[entityFieldAddressKey(EntityType.StellarTrade, [], '$baseLiquidityPool')]: {
				[EntityMetaKey.Selector]: {
					$network,
					liquidityPoolId: trade.base_liquidity_pool_id,
				},
			},
		}),
		...(trade.counter_liquidity_pool_id != null && {
			[entityFieldAddressKey(EntityType.StellarTrade, [], '$counterLiquidityPool')]: {
				[EntityMetaKey.Selector]: {
					$network,
					liquidityPoolId: trade.counter_liquidity_pool_id,
				},
			},
		}),
	},
})

export default {
	source: Source.StellarHorizon_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.StellarAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (account) => {
						assertStellarPublicNetwork(account.$network)
						const { getAccount } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						const snapshot = await getAccount(account.accountId)
						const nativeBalances = snapshot.balances.filter((balance) => balance.asset_type === 'native')
						if (nativeBalances.length !== 1)
							throw new Error('StellarHorizon_Rest: account must have exactly one native balance')

						return [{
							[EntityMetaKey.Selector]: {
								$account: account,
								timestampMs: timestampMsFromWire(snapshot.last_modified_time, 'account modification time'),
								source: Source.StellarHorizon_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'ledgerSequence')]: BigInt(snapshot.last_modified_ledger),
								[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'sequence')]: snapshot.sequence,
								[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'nativeBalance')]: nativeBalances[0].balance,
								[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'subentryCount')]: snapshot.subentry_count,
								[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'signerCount')]: snapshot.signers.length,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.StellarAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (account) => {
						assertStellarPublicNetwork(account.$network)
						const { getAccount } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						const snapshot = await getAccount(account.accountId)
						const timestampMs = timestampMsFromWire(snapshot.last_modified_time, 'account modification time')

						return snapshot.balances.flatMap((balance) => {
							if (
								balance.asset_type === 'native'
								|| balance.asset_type === 'liquidity_pool_shares'
							)
								return []

							const trustlineSelector = {
								$account: account,
								$asset: assetSelector(account.$network, balance),
							}

							return [{
								[EntityMetaKey.Selector]: trustlineSelector,
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.StellarTrustline, [], '$asset')]: {
										[EntityMetaKey.Selector]: trustlineSelector.$asset,
										[EntityMetaKey.Fields]: {
											...assetFields(balance),
											...(balance.asset_issuer != null && {
												[entityFieldAddressKey(EntityType.StellarAsset, [], '$issuerAccount')]: {
													[EntityMetaKey.Selector]: {
														$network: account.$network,
														accountId: balance.asset_issuer,
													},
												},
											}),
										},
									},
									[entityFieldAddressKey(EntityType.StellarTrustline, [], '$$timestamps')]: [{
										[EntityMetaKey.Selector]: {
											$trustline: trustlineSelector,
											timestampMs,
											source: Source.StellarHorizon_Rest,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'balance')]: balance.balance,
											...(balance.limit != null && {
												[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'limit')]: balance.limit,
											}),
											...(balance.buying_liabilities != null && {
												[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'buyingLiabilities')]: balance.buying_liabilities,
											}),
											...(balance.selling_liabilities != null && {
												[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'sellingLiabilities')]: balance.selling_liabilities,
											}),
											...(balance.last_modified_ledger != null && {
												[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'ledgerSequence')]: BigInt(balance.last_modified_ledger),
											}),
											...(balance.is_authorized != null && {
												[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'authorized')]: balance.is_authorized,
											}),
											...(balance.is_authorized_to_maintain_liabilities != null && {
												[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'authorizedToMaintainLiabilities')]: balance.is_authorized_to_maintain_liabilities,
											}),
											...(balance.is_clawback_enabled != null && {
												[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'clawbackEnabled')]: balance.is_clawback_enabled,
											}),
										},
									}],
								},
							}]
						})
					},
				},
			},
		})({
			$$trustlines: (trustlines) => trustlines,
		}),

		defineResolver({
			entityType: EntityType.StellarAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (account) => {
						assertStellarPublicNetwork(account.$network)
						const { getAccount } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						const snapshot = await getAccount(account.accountId)
						const timestampMs = timestampMsFromWire(snapshot.last_modified_time, 'account modification time')

						return snapshot.signers.map((signer) => {
							const signerSelector = {
								$account: account,
								signerKey: signer.key,
								signerType: signer.type,
							}

							return {
								[EntityMetaKey.Selector]: signerSelector,
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.StellarAccountSigner, [], '$$timestamps')]: [{
										[EntityMetaKey.Selector]: {
											$signer: signerSelector,
											timestampMs,
											source: Source.StellarHorizon_Rest,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.StellarAccountSigner_Timestamp, [], 'ledgerSequence')]: BigInt(snapshot.last_modified_ledger),
											[entityFieldAddressKey(EntityType.StellarAccountSigner_Timestamp, [], 'weight')]: signer.weight,
											[entityFieldAddressKey(EntityType.StellarAccountSigner_Timestamp, [], 'active')]: true,
											...(signer.sponsor != null && {
												[entityFieldAddressKey(EntityType.StellarAccountSigner_Timestamp, [], 'sponsor')]: signer.sponsor,
											}),
										},
									}],
								},
							}
						})
					},
				},
			},
		})({
			$$signers: (signers) => signers,
		}),

		defineResolver({
			entityType: EntityType.StellarAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (account, context) => {
						assertStellarPublicNetwork(account.$network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getAccountOffers } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getAccountOffers(
								account.accountId,
								limit,
								context.providerContinuationToken
							),
						}
					},
				},
			},
		})({
			$$offers: {
				select: ({ page }, account) => (
					page._embedded.records.map((offer) => offerFromWire(account.$network, offer))
				),
				continuation: ({ limit, page }, account) => (
					accountContinuation(
						'account-offers',
						account.accountId,
						limit,
						page._embedded.records
					)
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (account, context) => {
						assertStellarPublicNetwork(account.$network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getAccountTrades } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getAccountTrades(
								account.accountId,
								limit,
								context.providerContinuationToken
							),
						}
					},
				},
			},
		})({
			$$trades: {
				select: ({ page }, account) => (
					page._embedded.records.map((trade) => tradeFromWire(account.$network, trade))
				),
				continuation: ({ limit, page }, account) => (
					accountContinuation(
						'account-trades',
						account.accountId,
						limit,
						page._embedded.records
					)
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (account, context) => {
						assertStellarPublicNetwork(account.$network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getAccountTransactions } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getAccountTransactions(
								account.accountId,
								limit,
								context.providerContinuationToken
							),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: ({ page }, account) => page._embedded.records.map((transaction) => {
					const transactionSelector = {
						$network: account.$network,
						hash: transaction.hash,
					}

					return {
						[EntityMetaKey.Selector]: transactionSelector,
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.StellarTransaction, [], 'sourceAccount')]: transaction.source_account,
							[entityFieldAddressKey(EntityType.StellarTransaction, [], '$$timestamps')]: [
								transactionTimestampFields(transaction, transactionSelector),
							],
						},
					}
				}),
				continuation: ({ limit, page }, account) => (
					accountContinuation(
						'account-transactions',
						account.accountId,
						limit,
						page._embedded.records
					)
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarTransaction,
			resolve: {
				NetworkHash: {
					resolve: async ({ $network, hash }) => {
						assertStellarPublicNetwork($network)
						const { getTransaction } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						const transaction = await getTransaction(hash)
						const transactionSelector = {
							$network,
							hash,
						}

						return {
							sourceAccount: transaction.source_account,
							$$timestamps: [
								transactionTimestampFields(transaction, transactionSelector),
							],
						}
					},
				},
			},
		})({
			sourceAccount: (snapshot) => snapshot.sourceAccount,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.StellarTransaction,
			resolve: {
				NetworkHash: {
					resolve: async ({ $network, hash }, context) => {
						assertStellarPublicNetwork($network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const {
							getTransactionOperations,
							operationIndexFromHorizonId,
						} = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getTransactionOperations(
								hash,
								limit,
								context.providerContinuationToken
							),
							operationIndexFromHorizonId,
						}
					},
				},
			},
		})({
			$$operations: {
				select: ({ page, operationIndexFromHorizonId }, { $network, hash }) => (
					page._embedded.records.map((operation) => ({
						[EntityMetaKey.Selector]: {
							$transaction: {
								$network,
								hash,
							},
							operationIndex: operationIndexFromHorizonId(operation.id),
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.StellarOperation, [], 'operationType')]: operation.type,
							...(operation.source_account != null && {
								[entityFieldAddressKey(EntityType.StellarOperation, [], 'sourceAccount')]: operation.source_account,
							}),
							...(operation.transaction_successful != null && {
								[entityFieldAddressKey(EntityType.StellarOperation, [], 'resultCode')]: (
									operation.transaction_successful ?
										'successful'
									:
										'failed'
								),
							}),
						},
					}))
				),
				continuation: ({ limit, page }, { hash }) => {
					const records = page._embedded.records
					const nextCursor = records.at(-1)?.paging_token

					return nextCursor == null || records.length < limit ?
						{
							operation: 'transaction-operations',
							target: hash,
							terminal: true,
						}
					:
						{
							operation: 'transaction-operations',
							target: hash,
							terminal: false,
							token: nextCursor,
						}
				},
			},
		}),

	],
} satisfies RegisteredSourceResolverModule