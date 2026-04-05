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

		title = 'Blocks',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityId: EntityId<EntityType.Network>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// (Derived)
	const networkRowQuery = useLiveQuery(
		(q) => (
			q
				.from({
					n: entityCollections[EntityType.Network],
				})
				.where(({ n }) =>
					and(
						entityCollectionRowIdEqualsEntityIdByFields(
							n.$id,
							entityId,
							['chainId'],
						),
						inArray(
							n[entityCollectionRow.source],
							sourcesForEntityBaseLiveQuery(EntityType.Network),
						),
					),
				)
				.select(({ n }) => n)
		),
		[() => entityId],
	)

	const blocks = $derived(
		(
			mergeEntityCollectionRows(
				(networkRowQuery.data ?? []) as Record<string, unknown>[],
			)?.['$$evmBlocks'] as
				| Entity<EntityType.EvmBlock>[]
				| undefined ?? []
		),
	)

	const listLoading = $derived(networkRowQuery.isLoading)
	const listError = $derived(networkRowQuery.isError)


	// Components
	import Boundary from '$/components/Boundary.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmBlock}
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
					Loading blocks…
				</p>
			{:else if listError}
				<p role="alert">
					Could not load blocks.
				</p>
			{:else if blocks.length === 0}
				<p data-text="muted">
					No blocks (chain unavailable or RPC error).
				</p>
			{:else}
				<ul data-list>
					{#each blocks as blockRow (serializeEntityId(blockRow.$id as EntityId<EntityType.EvmBlock>))}
						<li>
							<a
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
									{
										networkId: String(entityId.chainId),
										blockNumber: String(blockRow.number),
									},
								)}
							>
								Block
								{String(blockRow.number)}
								<span data-text="muted">
									·
									{typeof blockRow.transactionCount === 'number' ?
										`${blockRow.transactionCount} txs`
									:	'—'}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</Boundary>
	{/snippet}
</EntitiesList>
