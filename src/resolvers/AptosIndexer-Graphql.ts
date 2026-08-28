import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey, entityFieldAddressKey, type EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const aptosNetworkApplicability = [
	{
		$network: {
			caip2: networkBySlug.aptos.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.aptos.slug,
		},
	},
] as const

const aptosNetworkReferenceApplicability = [
	{
		$network: aptosNetworkApplicability[0],
	},
	{
		$network: aptosNetworkApplicability[1],
	},
] as const

const aptosAccountObservationApplicability = [
	{
		$account: aptosNetworkReferenceApplicability[0],
		source: Source.AptosIndexer_Graphql,
	},
	{
		$account: aptosNetworkReferenceApplicability[1],
		source: Source.AptosIndexer_Graphql,
	},
] as const

const assertAptosMainnet = (network: NetworkId) => {
	if (
		!(
			'slug' in network
			&& network.slug === networkBySlug.aptos.slug
		)
		&& !(
			network.caip2 !== undefined
			&& network.caip2.namespace === networkBySlug.aptos.caip2.namespace
			&& network.caip2.reference === networkBySlug.aptos.caip2.reference
		)
	)
		throw new Error('AptosIndexer_Graphql: unsupported network')
}

const bigintFromWire = (
	value: string,
	fieldName: string
) => {
	try {
		return BigInt(value)
	} catch {
		throw new Error(`AptosIndexer_Graphql: malformed ${fieldName}`)
	}
}

const timestampMsFromWire = (
	value: string | null,
	fieldName: string
) => {
	if (value == null)
		return undefined

	const timestampMs = Date.parse(value)
	if (!Number.isFinite(timestampMs))
		throw new Error(`AptosIndexer_Graphql: malformed ${fieldName}`)

	return timestampMs
}

const assertSource = (source: string) => {
	if (source !== Source.AptosIndexer_Graphql)
		throw new Error('AptosIndexer_Graphql: observation source mismatch')
}

const aptosIndexerOffset = (context: ResolverContext) => {
	if (context.providerContinuationToken == null)
		return context.pagination.offset ?? 0
	if (!/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken))
		throw new Error('AptosIndexer_Graphql: invalid account transactions continuation')

	const offset = Number(context.providerContinuationToken)
	if (!Number.isSafeInteger(offset))
		throw new Error('AptosIndexer_Graphql: account transactions continuation is too large')

	return offset
}

const aptosIndexerResolver = <const _Resolver extends object>(_resolver: _Resolver) => ({
	..._resolver,
	source: Source.AptosIndexer_Graphql,
})

export const aptosAccountTransactionsResolver = aptosIndexerResolver(
	defineResolver({
		entityType: EntityType.AptosAccount,
		resolve: {
			NetworkAddress: {
				appliesTo: aptosNetworkReferenceApplicability,
				resolve: async (entitySelector, context) => {
					assertAptosMainnet(entitySelector.$network.$network)
					const { getAccountTransactions } = await import('$/sources/AptosIndexer/Graphql/queries.ts')

					return (await getAccountTransactions(
						entitySelector.address,
						resolverContextRowLimit(context),
						aptosIndexerOffset(context)
					)).map((transaction) => {
						const version = bigintFromWire(transaction.transaction_version, 'transaction version')

						return {
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								version,
							},
							...(transaction.user_transaction != null && {
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.AptosTransaction, [], 'transactionKind')]: 'user_transaction',
									[entityFieldAddressKey(EntityType.AptosTransaction, [], 'sender')]: transaction.user_transaction.sender,
									[entityFieldAddressKey(EntityType.AptosTransaction, [], '$$timestamps')]: [{
										[EntityMetaKey.Selector]: {
											$transaction: {
												$network: entitySelector.$network,
												version,
											},
											ledgerVersion: version,
											source: Source.AptosIndexer_Graphql,
										},
										[EntityMetaKey.Fields]: aptosTransactionObservationFields(transaction.user_transaction),
									}],
								},
							}),
						}
					})
				},
			},
		},
	})({
		$$transactions: {
			select: (transactions) => transactions,
			continuation: (transactions, _account, context) => {
				const limit = resolverContextRowLimit(context)
				const nextOffset = aptosIndexerOffset(context) + transactions.length
				const terminal = limit === 0 || transactions.length < limit

				return {
					operation: 'account-transactions',
					target: 'aptos-indexer',
					terminal,
					...(!terminal && { token: String(nextOffset) }),
				}
			},
		},
	})
)

export const aptosAccountBalancesResolver = aptosIndexerResolver(
	defineResolver({
		entityType: EntityType.AptosAccount,
		resolve: {
			NetworkAddress: {
				appliesTo: aptosNetworkReferenceApplicability,
				resolve: async (entitySelector, context) => {
					assertAptosMainnet(entitySelector.$network.$network)
					const { getCurrentFungibleAssetBalances } = await import('$/sources/AptosIndexer/Graphql/queries.ts')

					return (await getCurrentFungibleAssetBalances(
						entitySelector.address,
						resolverContextRowLimit(context),
						context.pagination.offset ?? 0
					))
						.flatMap((balance) => {
							if (balance.last_transaction_version == null)
								return []

							const timestampMs = timestampMsFromWire(balance.last_transaction_timestamp, 'balance last transaction timestamp')
							return [{
								[EntityMetaKey.Selector]: {
									$account: entitySelector,
									storageId: balance.storage_id,
									ledgerVersion: bigintFromWire(balance.last_transaction_version, 'balance last transaction version'),
									source: Source.AptosIndexer_Graphql,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.AptosCoinBalance_Timestamp, [], 'assetType')]: balance.asset_type,
									[entityFieldAddressKey(EntityType.AptosCoinBalance_Timestamp, [], 'isPrimary')]: balance.is_primary,
									[entityFieldAddressKey(EntityType.AptosCoinBalance_Timestamp, [], 'amount')]: bigintFromWire(balance.amount, 'balance amount'),
									[entityFieldAddressKey(EntityType.AptosCoinBalance_Timestamp, [], 'ownerAddress')]: balance.owner_address,
									...(balance.asset_type_v1 != null && {
										[entityFieldAddressKey(EntityType.AptosCoinBalance_Timestamp, [], 'coinType')]: balance.asset_type_v1,
									}),
									...(timestampMs != null && {
										[entityFieldAddressKey(EntityType.AptosCoinBalance_Timestamp, [], 'timestampMs')]: timestampMs,
									}),
								},
							}]
						})
				},
			},
		},
	})({
		$$balances: (balances) => balances,
	})
)

export const aptosCoinBalanceResolver = aptosIndexerResolver(
	defineResolver({
		entityType: EntityType.AptosCoinBalance_Timestamp,
		resolve: {
			AccountStorageIdLedgerVersionSource: {
				appliesTo: aptosAccountObservationApplicability,
				resolve: async ({
					$account,
					storageId,
					ledgerVersion,
					source,
				}) => {
					assertAptosMainnet($account.$network.$network)
					assertSource(source)
					const { getCurrentFungibleAssetBalance } = await import('$/sources/AptosIndexer/Graphql/queries.ts')
					const balance = await getCurrentFungibleAssetBalance(storageId)
					if (
						balance == null
						|| balance.storage_id !== storageId
						|| balance.owner_address !== $account.address
						|| balance.last_transaction_version == null
						|| bigintFromWire(balance.last_transaction_version, 'balance last transaction version') !== ledgerVersion
					)
						throw new Error('AptosIndexer_Graphql: current balance observation version mismatch')

					return {
						assetType: balance.asset_type,
						isPrimary: balance.is_primary,
						amount: bigintFromWire(balance.amount, 'balance amount'),
						ownerAddress: balance.owner_address,
						...(balance.asset_type_v1 != null && { coinType: balance.asset_type_v1 }),
						timestampMs: timestampMsFromWire(balance.last_transaction_timestamp, 'balance last transaction timestamp'),
					}
				},
			},
		},
	})({
		assetType: (balance) => balance.assetType,
		isPrimary: (balance) => balance.isPrimary,
		timestampMs: (balance) => balance.timestampMs,
		amount: (balance) => balance.amount,
		ownerAddress: (balance) => balance.ownerAddress,
		coinType: (balance) => balance.coinType,
	})
)

const aptosTransactionObservationFields = (
	transaction: {
		block_height: string
		gas_unit_price: string
		timestamp: string
	}
) => {
	const timestampMs = timestampMsFromWire(transaction.timestamp, 'transaction timestamp')
	return {
		...(timestampMs != null && {
			[entityFieldAddressKey(EntityType.AptosTransaction_Timestamp, [], 'timestampMs')]: timestampMs,
		}),
		[entityFieldAddressKey(EntityType.AptosTransaction_Timestamp, [], 'blockHeight')]: bigintFromWire(transaction.block_height, 'transaction block height'),
		[entityFieldAddressKey(EntityType.AptosTransaction_Timestamp, [], 'gasUnitPrice')]: bigintFromWire(transaction.gas_unit_price, 'transaction gas unit price'),
	}
}

export const aptosTransactionResolver = aptosIndexerResolver(
	defineResolver({
		entityType: EntityType.AptosTransaction,
		resolve: {
			NetworkVersion: {
				appliesTo: aptosNetworkReferenceApplicability,
				resolve: async ({ $network, version }) => {
					assertAptosMainnet($network.$network)
					const { getTransaction } = await import('$/sources/AptosIndexer/Graphql/queries.ts')
					const transaction = await getTransaction(version)
					if (transaction == null || bigintFromWire(transaction.version, 'transaction version') !== version)
						throw new Error('AptosIndexer_Graphql: transaction version mismatch')

					return {
						version,
						transactionKind: 'user_transaction',
						sender: transaction.sender,
						$$timestamps: [{
							[EntityMetaKey.Selector]: {
								$transaction: {
									$network,
									version,
								},
								ledgerVersion: version,
								source: Source.AptosIndexer_Graphql,
							},
							[EntityMetaKey.Fields]: aptosTransactionObservationFields(transaction),
						}],
					}
				},
			},
		},
	})({
		version: (transaction) => transaction.version,
		transactionKind: (transaction) => transaction.transactionKind,
		sender: (transaction) => transaction.sender,
		$$timestamps: (transaction) => transaction.$$timestamps,
	})
)

export const aptosTransactionTimestampResolver = aptosIndexerResolver(
	defineResolver({
		entityType: EntityType.AptosTransaction_Timestamp,
		resolve: {
			TransactionLedgerVersionSource: {
				appliesTo: [
					{
						$transaction: aptosNetworkReferenceApplicability[0],
						source: Source.AptosIndexer_Graphql,
					},
					{
						$transaction: aptosNetworkReferenceApplicability[1],
						source: Source.AptosIndexer_Graphql,
					},
				],
				resolve: async ({
					$transaction,
					ledgerVersion,
					source,
				}) => {
					assertAptosMainnet($transaction.$network.$network)
					assertSource(source)
					if (!('version' in $transaction) || $transaction.version !== ledgerVersion)
						throw new Error('AptosIndexer_Graphql: transaction observation version mismatch')

					const { getTransaction } = await import('$/sources/AptosIndexer/Graphql/queries.ts')
					const transaction = await getTransaction(ledgerVersion)
					if (transaction == null || bigintFromWire(transaction.version, 'transaction version') !== ledgerVersion)
						throw new Error('AptosIndexer_Graphql: transaction version mismatch')

					return {
						timestampMs: timestampMsFromWire(transaction.timestamp, 'transaction timestamp'),
						blockHeight: bigintFromWire(transaction.block_height, 'transaction block height'),
						gasUnitPrice: bigintFromWire(transaction.gas_unit_price, 'transaction gas unit price'),
					}
				},
			},
		},
	})({
		timestampMs: (transaction) => transaction.timestampMs,
		blockHeight: (transaction) => transaction.blockHeight,
		gasUnitPrice: (transaction) => transaction.gasUnitPrice,
	})
)

export const aptosTableItemResolver = aptosIndexerResolver(
	defineResolver({
		entityType: EntityType.AptosTableItem,
		resolve: {
			NetworkTableHandleKeyHash: {
				appliesTo: aptosNetworkReferenceApplicability,
				resolve: async (entitySelector) => {
					assertAptosMainnet(entitySelector.$network.$network)
					const { getTableItem } = await import('$/sources/AptosIndexer/Graphql/queries.ts')
					const { current } = await getTableItem(
						entitySelector.tableHandle,
						entitySelector.keyHash
					)
					if (
						current == null
						|| current.table_handle !== entitySelector.tableHandle
						|| current.key_hash !== entitySelector.keyHash
					)
						throw new Error('AptosIndexer_Graphql: current table item mismatch')

					const ledgerVersion = bigintFromWire(current.last_transaction_version, 'table item last transaction version')
					return {
						key: current.decoded_key,
						$$timestamps: [{
							[EntityMetaKey.Selector]: {
								$tableItem: entitySelector,
								ledgerVersion,
								source: Source.AptosIndexer_Graphql,
							},
							[EntityMetaKey.Fields]: {
								...(current.decoded_value != null && {
									[entityFieldAddressKey(EntityType.AptosTableItem_Timestamp, [], 'value')]: current.decoded_value,
								}),
								[entityFieldAddressKey(EntityType.AptosTableItem_Timestamp, [], 'pruned')]: current.is_deleted,
							},
						}],
					}
				},
			},
		},
	})({
		key: (tableItem) => tableItem.key,
		$$timestamps: (tableItem) => tableItem.$$timestamps,
	})
)

export const aptosTableItemTimestampResolver = aptosIndexerResolver(
	defineResolver({
		entityType: EntityType.AptosTableItem_Timestamp,
		resolve: {
			TableItemLedgerVersionSource: {
				appliesTo: [
					{
						$tableItem: aptosNetworkReferenceApplicability[0],
						source: Source.AptosIndexer_Graphql,
					},
					{
						$tableItem: aptosNetworkReferenceApplicability[1],
						source: Source.AptosIndexer_Graphql,
					},
				],
				resolve: async ({
					$tableItem,
					ledgerVersion,
					source,
				}) => {
					assertAptosMainnet($tableItem.$network.$network)
					assertSource(source)
					const { getTableItem } = await import('$/sources/AptosIndexer/Graphql/queries.ts')
					const { current, versioned } = await getTableItem(
						$tableItem.tableHandle,
						$tableItem.keyHash,
						ledgerVersion
					)
					if (
						versioned == null
						|| versioned.table_handle !== $tableItem.tableHandle
						|| bigintFromWire(versioned.transaction_version, 'table item transaction version') !== ledgerVersion
					)
						throw new Error('AptosIndexer_Graphql: versioned table item mismatch')

					return {
						value: versioned.decoded_value,
						...(
							current != null
							&& bigintFromWire(current.last_transaction_version, 'table item last transaction version') === ledgerVersion
							&& {
								pruned: current.is_deleted,
							}
						),
					}
				},
			},
		},
	})({
		value: (tableItem) => tableItem.value,
		pruned: (tableItem) => tableItem.pruned,
	})
)

export default {
	source: Source.AptosIndexer_Graphql,

	resolvers: [
		aptosAccountTransactionsResolver,
		aptosAccountBalancesResolver,
		aptosCoinBalanceResolver,
		aptosTransactionResolver,
		aptosTransactionTimestampResolver,
		aptosTableItemResolver,
		aptosTableItemTimestampResolver,
	],
} satisfies RegisteredSourceResolverModule
