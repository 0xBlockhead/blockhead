import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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
					const timestampMs = timestampMsFromWire(transaction.created_at, 'transaction creation time')
					const transactionSelector = {
						$network: account.$network,
						hash: transaction.hash,
					}

					return {
						[EntityMetaKey.Selector]: transactionSelector,
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.StellarTransaction, [], 'sourceAccount')]: transaction.source_account,
							[entityFieldAddressKey(EntityType.StellarTransaction, [], '$$timestamps')]: [{
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
							}],
						},
					}
				}),
				continuation: ({ limit, page }, account) => {
					const records = page._embedded.records
					const nextCursor = records.at(-1)?.paging_token

					return nextCursor == null || records.length < limit ?
						{
							operation: 'account-transactions',
							target: account.accountId,
							terminal: true,
						}
					:
						{
							operation: 'account-transactions',
							target: account.accountId,
							terminal: false,
							token: nextCursor,
						}
				},
			},
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.StellarHorizon_Rest>
