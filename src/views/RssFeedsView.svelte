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


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		id = 'rss-feeds',
		href = resolve('/rss/feeds'),
		title = 'Feeds',
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.RssFeed>
			id?: string
			href?: string
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

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
	{href}
	{title}
	{collapsible}
	bind:open
	{...entitiesListRest}
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

	{#snippet body()}
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
				{href}
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
					item: row,
				})}
					{#if row}
						<RssFeedView
							entityId={row.entityId}
							href={resolve('/(social)/(rss)/rss/feed/[feedKey]', {
								feedKey: encodeURIComponent(row.entityId.feedUrl),
							})}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
