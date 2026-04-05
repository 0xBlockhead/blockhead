<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { serializeEntityId } from '$/schema/$entityId.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { entityCollections } from '$/data/collections/entityCollections.ts'
	import { mergeEntityCollectionRows } from '$/data/tanstackDb/mergeEntityCollectionRows.ts'
	import { sourcesForEntityBaseLiveQuery } from '$/data/tanstackDb/entityQuerySources.ts'
	import { entityCollectionRowIdEqualsEntityIdByFields } from '$/data/tanstackDb/entityCollectionRowWhere.ts'
	import { entityCollectionRow } from '$/schema/$EntityCollectionRow.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { and, inArray, useLiveQuery } from '@tanstack/svelte-db'


	// Props
	let {
		entityId,

		title = 'Transactions',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityId: EntityId<EntityType.Network> | EntityId<EntityType.EvmBlock>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// (Derived)
	const txListScopeBlock = (
		id: EntityId<EntityType.Network> | EntityId<EntityType.EvmBlock>,
	): id is EntityId<EntityType.EvmBlock> => (
		'$network' in id &&
		'blockNumber' in id
	)

	// @ts-expect-error TanStack live-query typings require a single builder result type per callback.
	const txSourceQuery = useLiveQuery(
		(q) => (
			txListScopeBlock(entityId) ?
				q
					.from({
						row: entityCollections[EntityType.EvmBlock],
					})
					.where(({ row }) =>
						and(
							entityCollectionRowIdEqualsEntityIdByFields(
								row.$id,
								entityId,
								[
									'$network.chainId',
									'blockNumber',
								],
							),
							inArray(
								row[entityCollectionRow.source],
								sourcesForEntityBaseLiveQuery(EntityType.EvmBlock),
							),
						),
					)
					.select(({ row }) => ({
						scope: 'block',
						row,
					}))
			:	q
					.from({
						row: entityCollections[EntityType.Network],
					})
					.where(({ row }) =>
						and(
							entityCollectionRowIdEqualsEntityIdByFields(
								row.$id,
								entityId,
								['chainId'],
							),
							inArray(
								row[entityCollectionRow.source],
								sourcesForEntityBaseLiveQuery(EntityType.Network),
							),
						),
					)
					.select(({ row }) => ({
						scope: 'network',
						row,
					}))
		),
		[() => entityId],
	)

	const networkChainId = $derived(
		txListScopeBlock(entityId) ?
			entityId.$network.chainId
		:	entityId.chainId,
	)

	const transactions = $derived.by(() => {
		const packed = txSourceQuery.data ?? []
		if (packed.length === 0) return []
		const scopeRows = packed
			.map((p) => (p as { row?: Record<string, unknown> }).row)
			.filter((r): r is Record<string, unknown> => r != null)
		const merged = mergeEntityCollectionRows(scopeRows)
		const raw = merged?.['$$evmTransactions']
		return Array.isArray(raw) ? raw : []
	})

	const listLoading = $derived(txSourceQuery.isLoading)
	const listError = $derived(txSourceQuery.isError)


	// Components
	import Boundary from '$/components/Boundary.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmTransaction}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		<Boundary>
			{#snippet Failed(error, _retry)}
				<p role="alert">
					{String(error)}
				</p>
			{/snippet}

			{#if listLoading}
				<p data-text="muted">
					Loading transactions…
				</p>
			{:else if listError}
				<p role="alert">
					Could not load transactions.
				</p>
			{:else if transactions.length === 0}
				<p data-text="muted">
					No transactions to show.
				</p>
			{:else}
				<ul data-list>
					{#each transactions as txRow (serializeEntityId((txRow as Entity<EntityType.EvmTransaction>).$id))}
						<li>
							<a
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
									{
										networkId: String(networkChainId),
										transactionId: (txRow as Entity<EntityType.EvmTransaction>).$id.txHash,
									},
								)}
							>
								<code>
									{(txRow as Entity<EntityType.EvmTransaction>).$id.txHash}
								</code>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</Boundary>
	{/snippet}
</EntitiesList>
