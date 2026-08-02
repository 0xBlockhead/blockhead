import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.Mintscan,

	resolvers: [
		defineResolver({
			entityType: EntityType.CosmosAccount,
			resolve: {
				NetworkAddress: {
					appliesTo: [
						{
							$network: {
								caip2: networkBySlug.cosmos.caip2,
							},
						},
						{
							$network: {
								slug: networkBySlug.cosmos.slug,
							},
						},
					],
					resolve: async (accountSelector, context) => {
						if (
							!(
								'slug' in accountSelector.$network
								&& accountSelector.$network.slug === networkBySlug.cosmos.slug
							)
							&& !(
								'caip2' in accountSelector.$network
								&& accountSelector.$network.caip2.namespace === networkBySlug.cosmos.caip2.namespace
								&& accountSelector.$network.caip2.reference === networkBySlug.cosmos.caip2.reference
							)
						)
							throw new Error('Mintscan: unsupported network')

						const {
							getAccount,
							getLatestBlock,
						} = await import('$/sources/Mintscan/Rest/queries.ts')
						const [
							{ account },
							latestBlock,
						] = await Promise.all([
							getAccount(context.publicEnv, {
								network: networkBySlug.cosmos.slug,
								address: accountSelector.address,
							}),
							getLatestBlock(context.publicEnv, {
								network: networkBySlug.cosmos.slug,
							}),
						])
						const baseAccount = (
							account?.base_account
							?? account?.base_vesting_account?.base_account
							?? account
						)
						if (baseAccount == null)
							throw new Error('Mintscan: account response is missing')
						if (baseAccount.address !== accountSelector.address)
							throw new Error('Mintscan: account response does not match the subject')
						if (
							baseAccount.account_number != null
							&& !/^(0|[1-9]\d*)$/.test(baseAccount.account_number)
						)
							throw new Error('Mintscan: invalid account number')
						if (
							baseAccount.sequence != null
							&& !/^(0|[1-9]\d*)$/.test(baseAccount.sequence)
						)
							throw new Error('Mintscan: invalid account sequence')

						const timestampMs = Date.parse(latestBlock.block.header.time)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('Mintscan: latest block has an invalid timestamp')

						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$account: accountSelector,
									timestampMs,
									source: Source.Mintscan,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], '$account')]: {
										[EntityMetaKey.Selector]: accountSelector,
									},
									...(baseAccount.account_number != null && {
										[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'accountNumber')]: BigInt(baseAccount.account_number),
									}),
									...(baseAccount.sequence != null && {
										[entityFieldAddressKey(EntityType.CosmosAccount_Timestamp, [], 'sequence')]: BigInt(baseAccount.sequence),
									}),
								},
							}],
						}
					},
				},
			},
		})({
			$$timestamps: (account) => account.$$timestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.Mintscan>
