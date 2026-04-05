<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { serializeEntityId } from '$/schema/$entityId.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { entityFieldCollections } from '$/data/collections/entityFieldCollections.ts'
	import { entityCollections } from '$/data/collections/entityCollections.ts'
	import { mergeEntityCollectionRows } from '$/data/tanstackDb/mergeEntityCollectionRows.ts'
	import {
		sourcesForEntityBaseLiveQuery,
		sourcesForEntityFieldLiveQuery,
	} from '$/data/tanstackDb/entityQuerySources.ts'
	import { entityCollectionRowIdEqualsEntityIdByFields } from '$/data/tanstackDb/entityCollectionRowWhere.ts'
	import { entityCollectionRow } from '$/schema/$EntityCollectionRow.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { and, inArray, useLiveQuery } from '@tanstack/svelte-db'


	// Props
	let {
		entityId,

		title = 'Forks',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityId?: EntityId<EntityType.Network>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()

	// (Derived)
	// @ts-expect-error TanStack live-query typings require a single builder result type per callback.
	const forksQuery = useLiveQuery(
		(q) => (
			entityId != null ?
				q
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
						kind: 'network',
						row,
					}))
			:	q
					.from({
						row: entityFieldCollections[EntityType._Global]['$$networkForks'],
					})
					.where(({ row }) =>
						inArray(
							row[entityCollectionRow.source],
							sourcesForEntityFieldLiveQuery(EntityType._Global, '$$networkForks'),
						),
					)
					.select(({ row }) => ({
						kind: 'global',
						row,
					}))
		),
		[() => entityId],
	)

	const forks = $derived.by(() => {
		const rows = forksQuery.data ?? []
		if (rows.length === 0) return []
		if ((rows[0] as { kind?: string }).kind === 'network') {
			const networkRows = rows
				.map((r) => (r as { row?: Record<string, unknown> }).row)
				.filter((r): r is Record<string, unknown> => r != null)
			const merged = mergeEntityCollectionRows(networkRows)
			const raw = merged?.['$$forks']
			return Array.isArray(raw) ? raw : []
		}
		return rows
			.map((r) => (r as { row?: Entity<EntityType.NetworkFork> }).row)
			.filter((row): row is Entity<EntityType.NetworkFork> => row != null)
	})

	const listLoading = $derived(forksQuery.isLoading)
	const listError = $derived(forksQuery.isError)


	// Components
	import Boundary from '$/components/Boundary.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
</script>


<EntitiesList
	entityType={EntityType.NetworkFork}
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
					Loading forks…
				</p>
			{:else if listError}
				<p role="alert">
					Could not load forks.
				</p>
			{:else if forks.length === 0}
				<p data-text="muted">
					No fork metadata for this scope.
				</p>
			{:else}
				<ul data-list>
					{#each forks as forkRow (serializeEntityId(forkRow.$id))}
						<li>
							<a
								href={resolve('/(explore)/(forks)/fork/[forkId]', {
									forkId: `${forkRow.$id.$network.chainId}:${forkRow.$id.forkId}`,
								})}
							>
								{forkRow.name}
								<span data-text="muted">
									· chain {forkRow.$id.$network.chainId}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</Boundary>
	{/snippet}
</EntitiesList>
