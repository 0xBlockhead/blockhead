<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, or, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,

		title = 'Transactions',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmTransaction>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			| 'entityType'
			| 'getKey'
			| 'getSortValue'
			| 'items'
			| 'query'
		>
	> = $props()


	const parentKey = $derived(
		stringify(entityFieldReference.entityId),
	)

	const blockHeightParentKey = $derived(
		entityFieldReference.entityType === EntityType.EvmBlock ?
			stringify({
				chainId: (
					entityFieldReference.entityId
						.$network
						.chainId
				),
			})
		:
			parentKey
	)

	type TransactionRow = {
		[EntityMetaKey.Id]: EntityId<typeof schema, EntityType.EvmTransaction>
		[EntityMetaKey.IdKey]: string
		[EntityMetaKey.Source]: Source
	}

	const transactionKey = (row: TransactionRow) => (
		stringify(row[EntityMetaKey.Id])
	)

	const transactionSortValue = (row: TransactionRow) => (
		row[EntityMetaKey.Id].txHash
	)

	const blockHeightQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ blockHeight: entityFieldCollections[EntityType.Network].blockHeight })
				.where(({ blockHeight }) => (
					eq(
						blockHeight[EntityMetaKey.ParentIdKey],
						blockHeightParentKey,
					)
				))
				.where(({ blockHeight }) => (
					eq(
						blockHeight[EntityMetaKey.Source],
						Source.Voltaire_JsonRpc,
					)
				))
				.select(({ blockHeight }) => ({
					height: blockHeight[EntityMetaKey.Value],
				}))
				.findOne()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => blockHeightParentKey,
		],
	)

	const blockTransactionsQuery = useLiveQuery(
		(queryBuilder) => (
			entityFieldReference.entityType !== EntityType.EvmBlock ?
				queryBuilder
					.from({ $$transactions: entityFieldCollections[EntityType.EvmBlock]['$$transactions'] })
					.orderBy(({ $$transactions }) => (
						$$transactions[EntityMetaKey.ParentIdKey]
					), 'asc')
					.limit(0)
					.select(({ $$transactions }) => ({
						...$$transactions[EntityMetaKey.Value],
						[EntityMetaKey.Source]: $$transactions[EntityMetaKey.Source],
					}))
			:
			queryBuilder
				.from({ $$transactions: entityFieldCollections[EntityType.EvmBlock]['$$transactions'] })
				.where(({ $$transactions }) => (
					eq(
						$$transactions[EntityMetaKey.ParentIdKey],
						parentKey,
					)
				))
				.where(({ $$transactions }) => (
					or(
						eq(
							$$transactions[EntityMetaKey.Source],
							Source.Blockscout_Rest,
						),
						eq(
							$$transactions[EntityMetaKey.Source],
							Source.Voltaire_JsonRpc,
						),
					)
				))
				.orderBy(({ $$transactions }) => (
					$$transactions[EntityMetaKey.Value][EntityMetaKey.IdKey]
				), 'desc')
				.limit(100)
				.select(({ $$transactions }) => ({
					...$$transactions[EntityMetaKey.Value],
					[EntityMetaKey.Source]: $$transactions[EntityMetaKey.Source],
				}))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => parentKey,
			() => blockHeightQuery.data?.height,
		],
	)

	const networkTransactionsQuery = useLiveQuery(
		(queryBuilder) => (
			entityFieldReference.entityType !== EntityType.Network ?
				queryBuilder
					.from({ $$transactions: entityFieldCollections[EntityType.Network]['$$transactions'] })
					.orderBy(({ $$transactions }) => (
						$$transactions[EntityMetaKey.ParentIdKey]
					), 'asc')
					.limit(0)
					.select(({ $$transactions }) => ({
						...$$transactions[EntityMetaKey.Value],
						[EntityMetaKey.Source]: $$transactions[EntityMetaKey.Source],
					}))
			:
			queryBuilder
				.from({ $$transactions: entityFieldCollections[EntityType.Network]['$$transactions'] })
				.where(({ $$transactions }) => (
					eq(
						$$transactions[EntityMetaKey.ParentIdKey],
						parentKey,
					)
				))
				.where(({ $$transactions }) => (
					eq(
						$$transactions[EntityMetaKey.Source],
						Source.Blockscout_Rest,
					)
				))
				.orderBy(({ $$transactions }) => (
					$$transactions[EntityMetaKey.Value][EntityMetaKey.IdKey]
				), 'desc')
				.limit(8)
				.select(({ $$transactions }) => ({
					...$$transactions[EntityMetaKey.Value],
					[EntityMetaKey.Source]: $$transactions[EntityMetaKey.Source],
				}))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => parentKey,
			() => blockHeightQuery.data?.height,
		],
	)

	const transactionRows = $derived(
		[
			...new Map(
				[
					...(
						entityFieldReference.entityType === EntityType.EvmBlock ?
							(blockTransactionsQuery.data ?? [])
						: entityFieldReference.entityType === EntityType.Network ?
							(networkTransactionsQuery.data ?? [])
						:
							[]
					).filter((row) => (
						row[EntityMetaKey.Source] !== Source.Blockscout_Rest
					)),
					...(
						entityFieldReference.entityType === EntityType.EvmBlock ?
							(blockTransactionsQuery.data ?? [])
						: entityFieldReference.entityType === EntityType.Network ?
							(networkTransactionsQuery.data ?? [])
						:
							[]
					).filter((row) => (
						row[EntityMetaKey.Source] === Source.Blockscout_Rest
					)),
				].map((row) => [
					row[EntityMetaKey.IdKey],
					row,
				]),
			).values(),
		],
	)

	const transactionRowsQuery = $derived(
		{
			data: transactionRows,
			isLoading: (
				entityFieldReference.entityType === EntityType.EvmBlock ?
					blockTransactionsQuery.isLoading
				:
					networkTransactionsQuery.isLoading
			),
			isError: (
				entityFieldReference.entityType === EntityType.EvmBlock ?
					blockTransactionsQuery.isError
				:
					networkTransactionsQuery.isError
			),
			isReady: (
				entityFieldReference.entityType === EntityType.EvmBlock ?
					(blockTransactionsQuery.isLoading !== true && blockTransactionsQuery.isReady !== false)
				:
					(networkTransactionsQuery.isLoading !== true && networkTransactionsQuery.isReady !== false)
			),
			error: undefined,
			status: (
				entityFieldReference.entityType === EntityType.EvmBlock ?
					blockTransactionsQuery.status
				:
					networkTransactionsQuery.status
			),
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<EntitiesList
	{...entitiesListProps}
	entityType={EntityType.EvmTransaction}
	{title}
	bind:open
	items={transactionRows}
	getKey={transactionKey}
	getSortValue={transactionSortValue}
	placeholderKeys={new SvelteSet<string | number>()}
	query={transactionRowsQuery}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No transactions to show for this scope yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const t = row[EntityMetaKey.Id]}
			<EvmTransactionView
				entityId={t}
				href={(
					entityFieldReference.entityType === EntityType.EvmBlock ?
						resolve(
							'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]/(block)/(transactions)/tx/[transactionId]',
							{
								networkId: String(
									entityFieldReference.entityId.$network.chainId,
								),
								blockNumber: String(
									entityFieldReference.entityId.blockNumber,
								),
								transactionId: t.txHash,
							},
						)
					:
						resolve(
							'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
							{
								networkId: String(
									t.$network.chainId,
								),
								transactionId: t.txHash,
							},
						)
				)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
