<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityFieldReference,
		id = 'rss-feeds',
		title = 'Feeds',
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.RssFeed>
			id?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RssFeed}

	{id}
	{title}
	{collapsible}
	bind:open
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			RSS / Atom feed entities keyed by feedUrl; this list is seeded from Constants.
		</p>
		<p>
			Live metadata and $$items resolve via Rss_Rest (direct XML fetch) or Rss2Json (rss2json API proxy) when that source is enabled.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No RSS feeds in this hub yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Constants_Internal,
						],
					},
				},
			)}
			{@const feeds = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.RssFeed>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows.map((value) => ({
							entityId: value[EntityMetaKey.Id],
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.RssFeed}
				{id}
				{title}
				resource={feeds}
				placeholderText="Loading feeds…"
				getKey={(row) => stringify(row.entityId)}
				getSortValue={(row) => row.entityId.feedUrl}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No RSS feeds in this hub yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: feed,
				})}
					<RssFeedView
						entityId={feed.entityId}
						layout={EntityLayout.SummaryDetails}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
