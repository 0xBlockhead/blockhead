import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

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
						if (
							!('caip2' in account.$network)
							|| account.$network.caip2.namespace !== networkBySlug.xrpl.caip2.namespace
							|| account.$network.caip2.reference !== networkBySlug.xrpl.caip2.reference
						)
							throw new Error('Bithomp: unsupported network')

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
	],
} satisfies RegisteredSourceResolverModule
