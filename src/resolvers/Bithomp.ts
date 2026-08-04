import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const assertXrplMainnet = (network: {
	caip2?: {
		namespace: string
		reference: string
	}
}) => {
	if (
		!('caip2' in network)
		|| network.caip2 == null
		|| network.caip2.namespace !== networkBySlug.xrpl.caip2.namespace
		|| network.caip2.reference !== networkBySlug.xrpl.caip2.reference
	)
		throw new Error('Bithomp: unsupported network')
}

export default {
	source: Source.Bithomp,

	resolvers: [
		defineResolver({
			entityType: EntityType.XrplAccount,
			resolve: {
				NetworkAccount: {
					appliesTo: [{
						$network: {
							caip2: networkBySlug.xrpl.caip2,
						},
					}],
					resolve: async (account, context) => {
						assertXrplMainnet(account.$network)

						const { getAccount } = await import('$/sources/Bithomp/Rest/queries.ts')
						const response = await getAccount(context.publicEnv, {
							address: account.account,
						})
						if (response.address !== account.account)
							throw new Error('Bithomp: account response does not match the subject')

						const ledgerInfo = response.ledgerInfo
						if (ledgerInfo == null || ledgerInfo.error != null)
							throw new Error('Bithomp: account response is missing ledger information')
						if (
							ledgerInfo.ledger == null
							|| !Number.isSafeInteger(ledgerInfo.ledger)
							|| ledgerInfo.ledger < 0
						)
							throw new Error('Bithomp: malformed ledger index')
						if (
							ledgerInfo.ledgerTimestamp == null
							|| !Number.isSafeInteger(ledgerInfo.ledgerTimestamp)
							|| ledgerInfo.ledgerTimestamp < 0
							|| !Number.isSafeInteger(ledgerInfo.ledgerTimestamp * 1_000)
						)
							throw new Error('Bithomp: malformed ledger timestamp')
						if (ledgerInfo.balance == null || !/^(?:0|[1-9]\d*)$/.test(ledgerInfo.balance))
							throw new Error('Bithomp: malformed XRP balance')
						if (
							ledgerInfo.ownerCount == null
							|| !Number.isSafeInteger(ledgerInfo.ownerCount)
							|| ledgerInfo.ownerCount < 0
							|| ledgerInfo.sequence == null
							|| !Number.isSafeInteger(ledgerInfo.sequence)
							|| ledgerInfo.sequence < 0
						)
							throw new Error('Bithomp: malformed account counters')

						return [{
							[EntityMetaKey.Selector]: {
								$account: account,
								ledgerIndex: BigInt(ledgerInfo.ledger),
								source: Source.Bithomp,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'timestampMs')]: ledgerInfo.ledgerTimestamp * 1_000,
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'balanceDrops')]: BigInt(ledgerInfo.balance),
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'ownerCount')]: ledgerInfo.ownerCount,
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'sequence')]: ledgerInfo.sequence,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.XrplAmm,
			resolve: {
				NetworkAmmAccount: {
					appliesTo: [{
						$network: {
							caip2: networkBySlug.xrpl.caip2,
						},
					}],
					resolve: async (amm, context) => {
						assertXrplMainnet(amm.$network)

						const { getAmm } = await import('$/sources/Bithomp/Rest/queries.ts')
						const response = await getAmm(context.publicEnv, {
							id: amm.ammAccount,
						})
						if (response.account !== amm.ammAccount)
							throw new Error('Bithomp: amm response does not match the subject')
						if (response.amount == null || !/^(?:0|[1-9]\d*)$/.test(response.amount))
							throw new Error('Bithomp: malformed XRP asset amount')
						if (
							response.amount2?.currency == null
							|| response.amount2.currency.length === 0
							|| response.amount2.value == null
							|| response.amount2.value.length === 0
						)
							throw new Error('Bithomp: malformed issued asset')
						if (
							response.updatedLedgerIndex == null
							|| !Number.isSafeInteger(response.updatedLedgerIndex)
							|| response.updatedLedgerIndex < 0
						)
							throw new Error('Bithomp: malformed amm ledger index')
						if (
							response.updatedAt == null
							|| !Number.isSafeInteger(response.updatedAt)
							|| response.updatedAt < 0
							|| !Number.isSafeInteger(response.updatedAt * 1_000)
						)
							throw new Error('Bithomp: malformed amm timestamp')

						return {
							assetCurrency: 'XRP',
							...(response.amount2.issuer != null && response.amount2.issuer.length > 0 && {
								asset2Issuer: response.amount2.issuer,
							}),
							asset2Currency: response.amount2.currency,
							...(response.lpTokenBalance?.currency != null && response.lpTokenBalance.currency.length > 0 && {
								lpTokenCurrency: response.lpTokenBalance.currency,
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$amm: amm,
									ledgerIndex: BigInt(response.updatedLedgerIndex),
									source: Source.Bithomp,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'timestampMs')]: response.updatedAt * 1_000,
									[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'assetAmount')]: response.amount,
									[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'asset2Amount')]: response.amount2.value,
									...(response.lpTokenBalance?.value != null && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'lpTokenBalance')]: response.lpTokenBalance.value,
									}),
									...(response.tradingFee != null && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'tradingFee')]: response.tradingFee,
									}),
									...(response.auctionSlot != null && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'auctionSlot')]: response.auctionSlot,
									}),
									...(response.voteSlots != null && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'voteSlots')]: response.voteSlots,
									}),
								},
							}],
						}
					},
				},
			},
		})({
			assetCurrency: (snapshot) => snapshot.assetCurrency,
			asset2Currency: (snapshot) => snapshot.asset2Currency,
			asset2Issuer: (snapshot) => snapshot.asset2Issuer,
			lpTokenCurrency: (snapshot) => snapshot.lpTokenCurrency,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule
