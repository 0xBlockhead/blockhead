<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { type EntityFieldReference } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
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
			entityFieldReference: EntityFieldReference<typeof EntityType.EvmTransaction>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
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

	const blockHeightQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ blockHeight: entityFieldCollections[EntityType.Network].blockHeight! })
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

	const transactionsQuery = useLiveQuery(
		(queryBuilder) => (
			entityFieldReference.entityType === EntityType.EvmBlock ?
				queryBuilder
					.from({ $$evmTransactions: entityFieldCollections[EntityType.EvmBlock]['$$evmTransactions']! })
					.where(({ $$evmTransactions }) => (
						eq(
							$$evmTransactions[EntityMetaKey.ParentIdKey],
							parentKey,
						)
					))
					.where(({ $$evmTransactions }) => (
						or(
							eq(
								$$evmTransactions[EntityMetaKey.Source],
								Source.Blockscout_Rest,
							),
							eq(
								$$evmTransactions[EntityMetaKey.Source],
								Source.Voltaire_JsonRpc,
							),
						)
					))
					.orderBy(({ $$evmTransactions }) => (
						$$evmTransactions[EntityMetaKey.IdKey]
					), 'desc')
					.limit(100)
					.select(({ $$evmTransactions }) => (
					{
						[EntityMetaKey.Id]: (
							$$evmTransactions[EntityMetaKey.Value][EntityMetaKey.Id]
						),
					}
					))
			:
				queryBuilder
					.from({ $$evmTransactions: entityFieldCollections[EntityType.Network]['$$evmTransactions']! })
					.where(({ $$evmTransactions }) => (
						eq(
							$$evmTransactions[EntityMetaKey.ParentIdKey],
							parentKey,
						)
					))
					.where(({ $$evmTransactions }) => (
						eq(
							$$evmTransactions[EntityMetaKey.Source],
							Source.Blockscout_Rest,
						)
					))
					.orderBy(({ $$evmTransactions }) => (
						$$evmTransactions[EntityMetaKey.IdKey]
					), 'desc')
					.limit(8)
					.select(({ $$evmTransactions }) => (
					{
						[EntityMetaKey.Id]: (
							$$evmTransactions[EntityMetaKey.Value][EntityMetaKey.Id]
						),
					}
					))
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => parentKey,
			() => blockHeightQuery.data?.height,
		],
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmTransaction}
	{title}
	bind:open
	query={transactionsQuery}
	items={new SvelteSet(transactionsQuery.data ?? [])}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => row[EntityMetaKey.Id].txHash}
	placeholderKeys={new SvelteSet<string | number>()}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListProps}
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
