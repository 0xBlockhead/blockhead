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
		id = 'rss-items',
				limit = 25,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Items',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.RssItem>
			id?: string
			limit?: number
			open?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RssItem}

	{id}
	{title}
	{collapsible}
	bind:open
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Syndicated RSS / Atom entries keyed by feedUrl + guid; sorted in upstream feed order.
		</p>
		<p>
			Item fields resolve via Rss_Rest (direct XML) or Rss2Json (rss2json API); publishedAt is the syndication date, not a createdAt lifecycle field.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No RSS items here yet.
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
						Source.Rss_Rest,
						Source.Rss2Json_Rest,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Rss_Rest,
							Source.Rss2Json_Rest,
						],
					},
				},
			)}
			{@const rssItems = derive(
				parent,
				(parent) => {
					const rssItems: Entity<typeof schema, EntityType.RssItem>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rssItems
							.slice(0, limit)
							.map((value, index) => ({
								entityId: value[EntityMetaKey.Id],
								sortKey: index,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.RssItem}
				id={`${id}-items`}
				{title}
				resource={rssItems}
				placeholderText="Loading items…"
				getKey={(row) => stringify(rssItem.entityId)}
				getSortValue={(row) => rssItem.sortKey}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No RSS items here yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: rssItem,
				})}
					<RssItemView
						entityId={rssItem.entityId}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
