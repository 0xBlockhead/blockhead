<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		sourceId,
		title = 'Source',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			sourceId: string
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	const entityId = $derived(
		{ id: sourceId } satisfies EntityId<typeof schema, EntityType.BlockheadSource>,
	)

	const sourceIdKey = $derived(
		stringify(entityId),
	)

	const sourceQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.BlockheadSource] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						sourceIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => sourceIdKey],
	)

	const sourceRow = $derived(
		sourceQuery.data?.[0]?.row,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSource}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Source ID</dt>
				<dd>{sourceId}</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadSource}
				{entityId}
			>
				<QueryBoundary
					query={sourceQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No source data yet.
						</p>
					{:else}
						<p data-text="muted">
							Only basic source info is available here for now.
						</p>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
