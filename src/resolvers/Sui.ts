import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	type EntitySelector,
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

type NetworkSelector = EntitySelector<typeof schema, EntityType.Network>

const assertSuiNetwork = ($network: NetworkSelector) => {
	if ('caip2' in $network || $network.slug !== networkBySlug.sui.slug)
		throw new Error('Sui: unsupported network')
}

export default {
	source: Source.Sui,

	resolvers: [
		defineResolver({
			entityType: EntityType.SuiAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertSuiNetwork(account.$network.$network)
						const {
							getAddressBalances,
							normalizeSuiAddress,
						} = await import('$/sources/Sui/Graphql/queries.ts')
						const address = normalizeSuiAddress(account.address)

						return {
							address,
							page: await getAddressBalances({
								address,
								limit: Math.min(resolverContextRowLimit(context), 50),
								after: context.providerContinuationToken,
							}),
							timestampMs: Date.now(),
						}
					},
				},
			},
		})({
			$$balances: {
				select: ({
					address,
					page,
					timestampMs,
				}, account) => page.balances.map((balance) => ({
					[EntityMetaKey.Selector]: {
						$account: {
							$network: account.$network,
							address,
						},
						coinType: balance.coinType.repr,
						timestampMs,
						source: Source.Sui,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.SuiCoinBalance_Timestamp, [], 'totalBalance')]: BigInt(balance.totalBalance),
					},
				})),
				continuation: ({
					address,
					page,
				}) => (
					page.pagination.nextAfter == null ?
						{
							operation: 'account-balances',
							target: address,
							terminal: true,
						}
					:
						{
							operation: 'account-balances',
							target: address,
							terminal: false,
							token: page.pagination.nextAfter,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.SuiAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertSuiNetwork(account.$network.$network)
						const {
							getAddressTransactions,
							normalizeSuiAddress,
						} = await import('$/sources/Sui/Graphql/queries.ts')
						const address = normalizeSuiAddress(account.address)
						const page = await getAddressTransactions({
							address,
							limit: Math.min(resolverContextRowLimit(context), 50),
							after: context.providerContinuationToken,
						})

						return {
							address,
							page: {
								...page,
								transactions: page.transactions.map((transaction) => ({
									...transaction,
									...(transaction.sender != null && {
										sender: {
											address: normalizeSuiAddress(transaction.sender.address),
										},
									}),
								})),
							},
						}
					},
				},
			},
		})({
			$$transactions: {
				select: ({ page }, account) => page.transactions.map((transaction) => ({
					[EntityMetaKey.Selector]: {
						$network: account.$network,
						digest: transaction.digest,
					},
					...(transaction.sender != null && {
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.SuiTransaction, [], 'sender')]: transaction.sender.address,
						},
					}),
				})),
				continuation: ({
					address,
					page,
				}) => (
					page.pagination.nextAfter == null ?
						{
							operation: 'account-transactions',
							target: address,
							terminal: true,
						}
					:
						{
							operation: 'account-transactions',
							target: address,
							terminal: false,
							token: page.pagination.nextAfter,
						}
				),
			},
		}),
	] as const,
} satisfies RegisteredSourceResolverModule
