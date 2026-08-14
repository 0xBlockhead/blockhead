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
	StellarHorizonAccount,
	StellarHorizonBalance,
	StellarHorizonClaimableBalance,
	StellarHorizonOffer,
	StellarHorizonOperation,
	StellarHorizonTrade,
	StellarHorizonTransaction,
} from '$/sources/StellarHorizon/Rest/types.ts'
import type { getLiquidityPool } from '$/sources/StellarHorizon/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

type StellarHorizonLiquidityPoolSnapshot = Awaited<ReturnType<typeof getLiquidityPool>>

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

const accountTimestampFromWire = (
	$network: {
		$network: {
			slug: string
		}
	},
	account: StellarHorizonAccount
) => {
	const nativeBalances = account.balances.filter((balance) => balance.asset_type === 'native')
	if (nativeBalances.length !== 1)
		throw new Error('StellarHorizon_Rest: account must have exactly one native balance')

	return {
		[EntityMetaKey.Selector]: {
			$account: {
				$network,
				accountId: account.account_id,
			},
			timestampMs: timestampMsFromWire(account.last_modified_time, 'account modification time'),
			source: Source.StellarHorizon_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'ledgerSequence')]: BigInt(account.last_modified_ledger),
			[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'sequence')]: account.sequence,
			[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'nativeBalance')]: nativeBalances[0].balance,
			[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'subentryCount')]: account.subentry_count,
			[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'thresholds')]: account.thresholds,
			[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'signerCount')]: account.signers.length,
		},
	}
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

const stellarContinuation = (
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
			...(transaction.envelope_xdr != null && {
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'envelopeXdr')]: transaction.envelope_xdr,
			}),
			...(transaction.result_xdr != null && {
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'resultXdr')]: transaction.result_xdr,
			}),
			...(transaction.result_meta_xdr != null && {
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'metaXdr')]: transaction.result_meta_xdr,
			}),
			...(transaction.fee_meta_xdr != null && {
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'feeMetaXdr')]: transaction.fee_meta_xdr,
			}),
			...(transaction.signatures != null && transaction.signatures.length > 0 && {
				[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'signatures')]: [
					...transaction.signatures,
				],
			}),
		},
	}
}

const operationIdentityKeys = new Set([
	'_links',
	'id',
	'paging_token',
	'transaction_hash',
	'type',
	'type_i',
	'created_at',
	'transaction_successful',
	'source_account',
])

const operationBodyFromWire = (
	operation: StellarHorizonOperation
) => {
	const body = Object.fromEntries(
		Object.entries(operation)
			.filter(([key, value]) => (
				!operationIdentityKeys.has(key)
				&& value !== undefined
			))
	)

	return Object.keys(body).length > 0 ?
		body
	:
		undefined
}

const transactionFromWire = (
	$network: {
		$network: {
			slug: string
		}
	},
	transaction: StellarHorizonTransaction
) => {
	const transactionSelector = {
		$network,
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
}

const operationFromWire = (
	$network: {
		$network: {
			slug: string
		}
	},
	operation: StellarHorizonOperation,
	operationIndexFromHorizonId: (operationId: string) => number
) => {
	const body = operationBodyFromWire(operation)

	return {
		[EntityMetaKey.Selector]: {
			$transaction: {
				$network,
				hash: operation.transaction_hash,
			},
			operationIndex: operationIndexFromHorizonId(operation.id),
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.StellarOperation, [], 'operationType')]: operation.type,
			...(operation.source_account != null && {
				[entityFieldAddressKey(EntityType.StellarOperation, [], 'sourceAccount')]: operation.source_account,
			}),
			...(body != null && {
				[entityFieldAddressKey(EntityType.StellarOperation, [], 'body')]: body,
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
	}
}

const offerFields = (
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
		$seller: {
			[EntityMetaKey.Selector]: {
				$network,
				accountId: offer.seller,
			},
		},
		$sellingAsset: {
			[EntityMetaKey.Selector]: assetSelector($network, offer.selling),
			[EntityMetaKey.Fields]: assetFields(offer.selling),
		},
		$buyingAsset: {
			[EntityMetaKey.Selector]: assetSelector($network, offer.buying),
			[EntityMetaKey.Fields]: assetFields(offer.buying),
		},
		...(timestampMs != null && {
			$$timestamps: [{
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
	}
}

const horizonAssetQueryFromAssetKey = (
	assetKey: string
) => {
	if (assetKey === 'XLM')
		return 'native'
	const issued = /^([A-Za-z0-9]{1,12})-(G[A-Z2-7]{55})$/.exec(assetKey)
	if (issued == null)
		throw new Error('StellarHorizon_Rest: invalid asset key')
	return `${issued[1]}:${issued[2]}`
}

const claimableBalanceAssetIdentity = (
	asset: string
) => {
	if (asset === 'native')
		return {
			asset_type: 'native' as const,
		}

	const assetSeparatorIndex = asset.indexOf(':')
	if (assetSeparatorIndex < 1)
		throw new Error('StellarHorizon_Rest: invalid claimable balance asset')

	const assetCode = asset.slice(0, assetSeparatorIndex)
	const issuer = asset.slice(assetSeparatorIndex + 1)
	return {
		asset_type: (
			assetCode.length <= 4 ?
				'credit_alphanum4' as const
			:
				'credit_alphanum12' as const
		),
		asset_code: assetCode,
		asset_issuer: issuer,
	}
}

const claimableBalanceFields = (
	$network: {
		$network: {
			slug: string
		}
	},
	claimableBalance: StellarHorizonClaimableBalance
) => {
	const claimableBalanceSelector = {
		$network,
		claimableBalanceId: claimableBalance.id,
	}
	const timestampMs = timestampMsFromWire(claimableBalance.last_modified_time, 'claimable balance modification time')
	const asset = claimableBalanceAssetIdentity(claimableBalance.asset)

	return {
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$claimableBalance: claimableBalanceSelector,
				timestampMs,
				source: Source.StellarHorizon_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StellarClaimableBalance_Timestamp, [], 'ledgerSequence')]: BigInt(claimableBalance.last_modified_ledger),
				[entityFieldAddressKey(EntityType.StellarClaimableBalance_Timestamp, [], '$asset')]: {
					[EntityMetaKey.Selector]: assetSelector($network, asset),
					[EntityMetaKey.Fields]: assetFields(asset),
				},
				[entityFieldAddressKey(EntityType.StellarClaimableBalance_Timestamp, [], 'amount')]: claimableBalance.amount,
				[entityFieldAddressKey(EntityType.StellarClaimableBalance_Timestamp, [], 'claimants')]: claimableBalance.claimants,
				...(claimableBalance.sponsor != null && {
					[entityFieldAddressKey(EntityType.StellarClaimableBalance_Timestamp, [], 'sponsor')]: claimableBalance.sponsor,
				}),
			},
		}],
	}
}

const claimableBalanceFromWire = (
	$network: {
		$network: {
			slug: string
		}
	},
	claimableBalance: StellarHorizonClaimableBalance
) => {
	const fields = claimableBalanceFields($network, claimableBalance)
	return {
		[EntityMetaKey.Selector]: {
			$network,
			claimableBalanceId: claimableBalance.id,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.StellarClaimableBalance, [], '$$timestamps')]: fields.$$timestamps,
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
	const fields = offerFields($network, offer)
	return {
		[EntityMetaKey.Selector]: {
			$network,
			offerId: offer.id,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.StellarOffer, [], '$seller')]: fields.$seller,
			[entityFieldAddressKey(EntityType.StellarOffer, [], '$sellingAsset')]: fields.$sellingAsset,
			[entityFieldAddressKey(EntityType.StellarOffer, [], '$buyingAsset')]: fields.$buyingAsset,
			...(fields.$$timestamps != null && {
				[entityFieldAddressKey(EntityType.StellarOffer, [], '$$timestamps')]: fields.$$timestamps,
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

const liquidityPoolFields = (
	$network: {
		$network: {
			slug: string
		}
	},
	liquidityPool: StellarHorizonLiquidityPoolSnapshot
) => {
	const liquidityPoolSelector = {
		$network,
		liquidityPoolId: liquidityPool.liquidityPoolId,
	}

	return {
		$assetA: {
			[EntityMetaKey.Selector]: {
				$network,
				assetKey: liquidityPool.reserveA.assetKey,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetKind')]: liquidityPool.reserveA.assetKind,
				...(liquidityPool.reserveA.assetCode != null && {
					[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetCode')]: liquidityPool.reserveA.assetCode,
				}),
				...(liquidityPool.reserveA.issuer != null && {
					[entityFieldAddressKey(EntityType.StellarAsset, [], 'issuer')]: liquidityPool.reserveA.issuer,
				}),
			},
		},
		$assetB: {
			[EntityMetaKey.Selector]: {
				$network,
				assetKey: liquidityPool.reserveB.assetKey,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetKind')]: liquidityPool.reserveB.assetKind,
				...(liquidityPool.reserveB.assetCode != null && {
					[entityFieldAddressKey(EntityType.StellarAsset, [], 'assetCode')]: liquidityPool.reserveB.assetCode,
				}),
				...(liquidityPool.reserveB.issuer != null && {
					[entityFieldAddressKey(EntityType.StellarAsset, [], 'issuer')]: liquidityPool.reserveB.issuer,
				}),
			},
		},
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$liquidityPool: liquidityPoolSelector,
				timestampMs: liquidityPool.timestampMs,
				source: Source.StellarHorizon_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StellarLiquidityPool_Timestamp, [], 'ledgerSequence')]: liquidityPool.ledgerSequence,
				[entityFieldAddressKey(EntityType.StellarLiquidityPool_Timestamp, [], 'reserveA')]: liquidityPool.reserveA.amount,
				[entityFieldAddressKey(EntityType.StellarLiquidityPool_Timestamp, [], 'reserveB')]: liquidityPool.reserveB.amount,
				[entityFieldAddressKey(EntityType.StellarLiquidityPool_Timestamp, [], 'totalShares')]: liquidityPool.totalShares,
				[entityFieldAddressKey(EntityType.StellarLiquidityPool_Timestamp, [], 'accounts')]: liquidityPool.accounts,
			},
		}],
	}
}

export default {
	source: Source.StellarHorizon_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.StellarNetwork,
			resolve: {
				Network: {
					resolve: async ($network, context) => {
						assertStellarPublicNetwork($network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getLiquidityPools } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getLiquidityPools(limit, context.providerContinuationToken),
						}
					},
				},
			},
		})({
			$$liquidityPools: {
				select: ({ page }, $network) => page._embedded.records.map((liquidityPool) => {
					const fields = liquidityPoolFields($network, liquidityPool)
					return {
						[EntityMetaKey.Selector]: {
							$network,
							liquidityPoolId: liquidityPool.liquidityPoolId,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.StellarLiquidityPool, [], 'poolType')]: liquidityPool.poolType,
							[entityFieldAddressKey(EntityType.StellarLiquidityPool, [], 'feeBps')]: liquidityPool.feeBps,
							[entityFieldAddressKey(EntityType.StellarLiquidityPool, [], '$assetA')]: fields.$assetA,
							[entityFieldAddressKey(EntityType.StellarLiquidityPool, [], '$assetB')]: fields.$assetB,
							[entityFieldAddressKey(EntityType.StellarLiquidityPool, [], '$$timestamps')]: fields.$$timestamps,
						},
					}
				}),
				continuation: ({ limit, page }, $network) => {
					const nextCursor = page._embedded.records.at(-1)?.pagingToken
					return nextCursor == null || page._embedded.records.length < limit ?
						{
							operation: 'stellar-liquidity-pools',
							target: $network.$network.slug,
							terminal: true,
						}
					:
						{
							operation: 'stellar-liquidity-pools',
							target: $network.$network.slug,
							terminal: false,
							token: nextCursor,
						}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.StellarLiquidityPool,
			resolve: {
				NetworkLiquidityPoolId: {
					resolve: async ({
						$network,
						liquidityPoolId,
					}) => {
						assertStellarPublicNetwork($network)
						const { getLiquidityPool } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return getLiquidityPool(liquidityPoolId)
					},
				},
			},
		})({
			poolType: (liquidityPool) => liquidityPool.poolType,
			feeBps: (liquidityPool) => liquidityPool.feeBps,
			$assetA: (liquidityPool, { $network }) => liquidityPoolFields($network, liquidityPool).$assetA,
			$assetB: (liquidityPool, { $network }) => liquidityPoolFields($network, liquidityPool).$assetB,
		}),

		defineResolver({
			entityType: EntityType.StellarLiquidityPool_Timestamp,
			resolve: {
				LiquidityPoolTimestampMsSource: {
					resolve: async ({
						$liquidityPool,
						source,
						timestampMs,
					}) => {
						assertStellarPublicNetwork($liquidityPool.$network)
						if (source !== Source.StellarHorizon_Rest)
							throw new Error('StellarHorizon_Rest: liquidity pool observation source mismatch')
						const { getLiquidityPool } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						const liquidityPool = await getLiquidityPool($liquidityPool.liquidityPoolId)
						if (liquidityPool.timestampMs !== timestampMs)
							throw new Error('StellarHorizon_Rest: liquidity pool observation timestamp mismatch')
						return liquidityPool
					},
				},
			},
		})({
			ledgerSequence: (liquidityPool) => liquidityPool.ledgerSequence,
			reserveA: (liquidityPool) => liquidityPool.reserveA.amount,
			reserveB: (liquidityPool) => liquidityPool.reserveB.amount,
			totalShares: (liquidityPool) => liquidityPool.totalShares,
			accounts: (liquidityPool) => liquidityPool.accounts,
		}),

		defineResolver({
			entityType: EntityType.StellarAccount,
			resolve: {
				NetworkAccountId: {
					resolve: async (account) => {
						assertStellarPublicNetwork(account.$network)
						const { getAccount } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return [accountTimestampFromWire(account.$network, await getAccount(account.accountId))]
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
			$$trustlines: {
				select: (trustlines) => trustlines,
				resolveCount: (trustlines) => trustlines.length,
			},
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
			$$signers: {
				select: (signers) => signers,
				resolveCount: (signers) => signers.length,
			},
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
					stellarContinuation(
						'account-offers',
						account.accountId,
						limit,
						page._embedded.records
					)
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarOffer,
			resolve: {
				NetworkOfferId: {
					resolve: async ({ $network, offerId }) => {
						assertStellarPublicNetwork($network)
						const { getOffer } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return offerFields($network, await getOffer(offerId))
					},
				},
			},
		})({
			$seller: (offer) => offer.$seller,
			$sellingAsset: (offer) => offer.$sellingAsset,
			$buyingAsset: (offer) => offer.$buyingAsset,
			$$timestamps: (offer) => offer.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.StellarOffer,
			resolve: {
				NetworkOfferId: {
					resolve: async ({ $network, offerId }, context) => {
						assertStellarPublicNetwork($network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getOfferTrades } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getOfferTrades(
								offerId,
								limit,
								context.providerContinuationToken
							),
						}
					},
				},
			},
		})({
			$$trades: {
				select: ({ page }, { $network }) => (
					page._embedded.records.map((trade) => tradeFromWire($network, trade))
				),
				continuation: ({ limit, page }, { offerId }) => (
					stellarContinuation(
						'offer-trades',
						offerId,
						limit,
						page._embedded.records
					)
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarOffer_Timestamp,
			resolve: {
				OfferTimestampMsSource: {
					resolve: async ({ $offer, source, timestampMs }) => {
						assertStellarPublicNetwork($offer.$network)
						if (source !== Source.StellarHorizon_Rest)
							throw new Error('StellarHorizon_Rest: offer observation source mismatch')
						const { getOffer } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						const offer = await getOffer($offer.offerId)
						if (
							offer.last_modified_time == null
							|| timestampMsFromWire(offer.last_modified_time, 'offer modification time') !== timestampMs
						)
							throw new Error('StellarHorizon_Rest: offer observation timestamp mismatch')
						return offer
					},
				},
			},
		})({
			ledgerSequence: (offer) => BigInt(offer.last_modified_ledger),
			amount: (offer) => offer.amount,
			price: (offer) => offer.price,
			priceNumerator: (offer) => BigInt(offer.price_r.n),
			priceDenominator: (offer) => BigInt(offer.price_r.d),
			sponsor: (offer) => offer.sponsor,
			active: () => true,
			lastModifiedTimeMs: (offer) => (
				offer.last_modified_time == null ?
					undefined
				:
					timestampMsFromWire(offer.last_modified_time, 'offer modification time')
			),
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
					stellarContinuation(
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
					stellarContinuation(
						'account-transactions',
						account.accountId,
						limit,
						page._embedded.records
					)
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarLedger,
			resolve: {
				NetworkSequence: {
					resolve: async (ledger, context) => {
						assertStellarPublicNetwork(ledger.$network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getLedgerTransactions } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getLedgerTransactions(
								ledger.sequence,
								limit,
								context.providerContinuationToken
							),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: ({ page }, ledger) => (
					page._embedded.records.map((transaction) => (
						transactionFromWire(ledger.$network, transaction)
					))
				),
				continuation: ({ limit, page }, ledger) => (
					stellarContinuation(
						'ledger-transactions',
						ledger.sequence.toString(),
						limit,
						page._embedded.records
					)
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarLedger,
			resolve: {
				NetworkSequence: {
					resolve: async (ledger, context) => {
						assertStellarPublicNetwork(ledger.$network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const {
							getLedgerOperations,
							operationIndexFromHorizonId,
						} = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							operationIndexFromHorizonId,
							page: await getLedgerOperations(
								ledger.sequence,
								limit,
								context.providerContinuationToken
							),
						}
					},
				},
			},
		})({
			$$operations: {
				select: ({ page, operationIndexFromHorizonId }, ledger) => (
					page._embedded.records.map((operation) => (
						operationFromWire(
							ledger.$network,
							operation,
							operationIndexFromHorizonId
						)
					))
				),
				continuation: ({ limit, page }, ledger) => (
					stellarContinuation(
						'ledger-operations',
						ledger.sequence.toString(),
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
							operationCount: transaction.operation_count,
							$$timestamps: [
								transactionTimestampFields(transaction, transactionSelector),
							],
						}
					},
				},
			},
		})({
			sourceAccount: (snapshot) => snapshot.sourceAccount,
			$$operations: {
				resolveCount: (snapshot) => snapshot.operationCount,
			},
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
					page._embedded.records.map((operation) => {
						const body = operationBodyFromWire(operation)

						return {
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
								...(body != null && {
									[entityFieldAddressKey(EntityType.StellarOperation, [], 'body')]: body,
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
						}
					})
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

		defineResolver({
			entityType: EntityType.StellarLiquidityPool,
			resolve: {
				NetworkLiquidityPoolId: {
					resolve: async ({
						$network,
						liquidityPoolId,
					}) => {
						assertStellarPublicNetwork($network)
						const { getLiquidityPool } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return getLiquidityPool(liquidityPoolId)
					},
				},
			},
		})({
			$$timestamps: (liquidityPool, { $network }) => liquidityPoolFields($network, liquidityPool).$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.StellarNetwork,
			resolve: {
				Network: {
					resolve: async ($network, context) => {
						assertStellarPublicNetwork($network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getAccounts } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getAccounts(limit, context.providerContinuationToken),
						}
					},
				},
			},
		})({
			$$accounts: {
				select: ({ page }, $network) => page._embedded.records.map((account) => ({
					[EntityMetaKey.Selector]: {
						$network,
						accountId: account.account_id,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.StellarAccount, [], '$$timestamps')]: [
							accountTimestampFromWire($network, account),
						],
					},
				})),
				continuation: ({ limit, page }, $network) => stellarContinuation(
					'network-accounts',
					$network.$network.slug,
					limit,
					page._embedded.records
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarNetwork,
			resolve: {
				Network: {
					resolve: async ($network, context) => {
						assertStellarPublicNetwork($network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getTransactions } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getTransactions(limit, context.providerContinuationToken),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: ({ page }, $network) => page._embedded.records.map((transaction) => (
					transactionFromWire($network, transaction)
				)),
				continuation: ({ limit, page }, $network) => stellarContinuation(
					'network-transactions',
					$network.$network.slug,
					limit,
					page._embedded.records
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarNetwork,
			resolve: {
				Network: {
					resolve: async ($network, context) => {
						assertStellarPublicNetwork($network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const {
							getOperations,
							operationIndexFromHorizonId,
						} = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							operationIndexFromHorizonId,
							page: await getOperations(limit, context.providerContinuationToken),
						}
					},
				},
			},
		})({
			$$operations: {
				select: ({ page, operationIndexFromHorizonId }, $network) => page._embedded.records.map((operation) => (
					operationFromWire($network, operation, operationIndexFromHorizonId)
				)),
				continuation: ({ limit, page }, $network) => stellarContinuation(
					'network-operations',
					$network.$network.slug,
					limit,
					page._embedded.records
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarNetwork,
			resolve: {
				Network: {
					resolve: async ($network, context) => {
						assertStellarPublicNetwork($network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getOffers } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getOffers(limit, context.providerContinuationToken),
						}
					},
				},
			},
		})({
			$$offers: {
				select: ({ page }, $network) => page._embedded.records.map((offer) => (
					offerFromWire($network, offer)
				)),
				continuation: ({ limit, page }, $network) => stellarContinuation(
					'network-offers',
					$network.$network.slug,
					limit,
					page._embedded.records
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarNetwork,
			resolve: {
				Network: {
					resolve: async ($network, context) => {
						assertStellarPublicNetwork($network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getTrades } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getTrades(limit, context.providerContinuationToken),
						}
					},
				},
			},
		})({
			$$trades: {
				select: ({ page }, $network) => page._embedded.records.map((trade) => (
					tradeFromWire($network, trade)
				)),
				continuation: ({ limit, page }, $network) => stellarContinuation(
					'network-trades',
					$network.$network.slug,
					limit,
					page._embedded.records
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarNetwork,
			resolve: {
				Network: {
					resolve: async ($network, context) => {
						assertStellarPublicNetwork($network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getClaimableBalances } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getClaimableBalances(limit, context.providerContinuationToken),
						}
					},
				},
			},
		})({
			$$claimableBalances: {
				select: ({ page }, $network) => page._embedded.records.map((claimableBalance) => (
					claimableBalanceFromWire($network, claimableBalance)
				)),
				continuation: ({ limit, page }, $network) => stellarContinuation(
					'network-claimableBalances',
					$network.$network.slug,
					limit,
					page._embedded.records
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarAsset,
			resolve: {
				NetworkAssetKey: {
					resolve: async (asset, context) => {
						assertStellarPublicNetwork(asset.$network)
						const limit = Math.min(resolverContextRowLimit(context), 200)
						const { getClaimableBalances } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return {
							limit,
							page: await getClaimableBalances(
								limit,
								context.providerContinuationToken,
								horizonAssetQueryFromAssetKey(asset.assetKey)
							),
						}
					},
				},
			},
		})({
			$$claimableBalances: {
				select: ({ page }, asset) => page._embedded.records.map((claimableBalance) => (
					claimableBalanceFromWire(asset.$network, claimableBalance)
				)),
				continuation: ({ limit, page }, asset) => stellarContinuation(
					'asset-claimableBalances',
					asset.assetKey,
					limit,
					page._embedded.records
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StellarClaimableBalance,
			resolve: {
				NetworkClaimableBalanceId: {
					resolve: async ({
						$network,
						claimableBalanceId,
					}) => {
						assertStellarPublicNetwork($network)
						const { getClaimableBalance } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						return claimableBalanceFields($network, await getClaimableBalance(claimableBalanceId))
					},
				},
			},
		})({
			$$timestamps: (claimableBalance) => claimableBalance.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.StellarClaimableBalance_Timestamp,
			resolve: {
				ClaimableBalanceTimestampMsSource: {
					resolve: async ({
						$claimableBalance,
						source,
						timestampMs,
					}) => {
						assertStellarPublicNetwork($claimableBalance.$network)
						if (source !== Source.StellarHorizon_Rest)
							throw new Error('StellarHorizon_Rest: claimable balance observation source mismatch')
						const { getClaimableBalance } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						const claimableBalance = await getClaimableBalance($claimableBalance.claimableBalanceId)
						if (
							timestampMsFromWire(claimableBalance.last_modified_time, 'claimable balance modification time') !== timestampMs
						)
							throw new Error('StellarHorizon_Rest: claimable balance observation timestamp mismatch')
						return claimableBalance
					},
				},
			},
		})({
			ledgerSequence: (claimableBalance) => BigInt(claimableBalance.last_modified_ledger),
			$asset: (claimableBalance, { $claimableBalance }) => {
				const asset = claimableBalanceAssetIdentity(claimableBalance.asset)
				return {
					[EntityMetaKey.Selector]: assetSelector($claimableBalance.$network, asset),
					[EntityMetaKey.Fields]: assetFields(asset),
				}
			},
			amount: (claimableBalance) => claimableBalance.amount,
			sponsor: (claimableBalance) => claimableBalance.sponsor,
			claimants: (claimableBalance) => claimableBalance.claimants,
		}),

		defineResolver({
			entityType: EntityType.StellarTrustline,
			resolve: {
				AccountAsset: {
					resolve: async (trustline) => {
						assertStellarPublicNetwork(trustline.$account.$network)
						assertStellarPublicNetwork(trustline.$asset.$network)
						const { getAccount } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						const accountSnapshot = await getAccount(trustline.$account.accountId)
						const balances = accountSnapshot.balances.filter((balance) => (
							balance.asset_type !== 'native'
							&& balance.asset_type !== 'liquidity_pool_shares'
							&& assetKeyFromIdentity(balance) === trustline.$asset.assetKey
						))
						if (balances.length !== 1)
							throw new Error('StellarHorizon_Rest: trustline not found')

						const balance = balances[0]
						return {
							$asset: {
								[EntityMetaKey.Selector]: trustline.$asset,
								[EntityMetaKey.Fields]: assetFields(balance),
							},
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$trustline: trustline,
									timestampMs: timestampMsFromWire(accountSnapshot.last_modified_time, 'account modification time'),
									source: Source.StellarHorizon_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'balance')]: balance.balance,
									...(balance.limit != null && {
										[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'limit')]: balance.limit,
									}),
									...(balance.last_modified_ledger != null && {
										[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'ledgerSequence')]: BigInt(balance.last_modified_ledger),
									}),
									...(balance.buying_liabilities != null && {
										[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'buyingLiabilities')]: balance.buying_liabilities,
									}),
									...(balance.selling_liabilities != null && {
										[entityFieldAddressKey(EntityType.StellarTrustline_Timestamp, [], 'sellingLiabilities')]: balance.selling_liabilities,
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
						}
					},
				},
			},
		})({
			$asset: (snapshot) => snapshot.$asset,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.StellarAccountSigner,
			resolve: {
				AccountSignerKeySignerType: {
					resolve: async (signerSelector) => {
						assertStellarPublicNetwork(signerSelector.$account.$network)
						const { getAccount } = await import('$/sources/StellarHorizon/Rest/queries.ts')
						const accountSnapshot = await getAccount(signerSelector.$account.accountId)
						const signers = accountSnapshot.signers.filter((signer) => (
							signer.key === signerSelector.signerKey
							&& signer.type === signerSelector.signerType
						))
						if (signers.length !== 1)
							throw new Error('StellarHorizon_Rest: account signer not found')

						const signer = signers[0]
						return [{
							[EntityMetaKey.Selector]: {
								$signer: signerSelector,
								timestampMs: timestampMsFromWire(accountSnapshot.last_modified_time, 'account modification time'),
								source: Source.StellarHorizon_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.StellarAccountSigner_Timestamp, [], 'ledgerSequence')]: BigInt(accountSnapshot.last_modified_ledger),
								[entityFieldAddressKey(EntityType.StellarAccountSigner_Timestamp, [], 'weight')]: signer.weight,
								[entityFieldAddressKey(EntityType.StellarAccountSigner_Timestamp, [], 'active')]: true,
								...(signer.sponsor != null && {
									[entityFieldAddressKey(EntityType.StellarAccountSigner_Timestamp, [], 'sponsor')]: signer.sponsor,
								}),
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

	],
} satisfies RegisteredSourceResolverModule
