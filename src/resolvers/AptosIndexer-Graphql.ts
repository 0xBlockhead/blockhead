import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey, type EntitySelector } from '$/schema/$schema.ts'
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
			'caip2' in network
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
						context.pagination.offset ?? 0
					)).map((transaction) => ({
						[EntityMetaKey.Selector]: {
							$network: entitySelector.$network,
							version: bigintFromWire(transaction.transaction_version, 'transaction version'),
						},
					}))
				},
			},
		},
	})({
		$$transactions: (transactions) => transactions,
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
						.flatMap((balance) => (
							balance.last_transaction_version == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										$account: entitySelector,
										storageId: balance.storage_id,
										ledgerVersion: bigintFromWire(balance.last_transaction_version, 'balance last transaction version'),
										source: Source.AptosIndexer_Graphql,
									},
								}]
						))
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
					}
				},
			},
		},
	})({
		version: (transaction) => transaction.version,
		transactionKind: (transaction) => transaction.transactionKind,
		sender: (transaction) => transaction.sender,
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

					return {
						key: current.decoded_key,
					}
				},
			},
		},
	})({
		key: (tableItem) => tableItem.key,
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
					const { versioned } = await getTableItem(
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
					}
				},
			},
		},
	})({
		value: (tableItem) => tableItem.value,
	})
)

export default {
	source: Source.AptosIndexer_Graphql,

	resolvers: [
		aptosAccountTransactionsResolver,
		aptosAccountBalancesResolver,
		aptosCoinBalanceResolver,
		aptosTransactionResolver,
		aptosTableItemResolver,
		aptosTableItemTimestampResolver,
	],
} satisfies RegisteredSourceResolverModule<Source.AptosIndexer_Graphql>
