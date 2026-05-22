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
		id = 'rss-items',
		href = resolve('/rss/items'),
		limit = 25,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Items',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.RssItem>
			id?: string
			href?: string
			limit?: number
			open?: boolean
			title?: string
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
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RssItem}
	{id}
	{href}
	{title}
	{collapsible}
	bind:open
	{...entitiesListRest}
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

	{#snippet body()}
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
			{@const items = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.RssItem>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows
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
				{href}
				{title}
				resource={items}
				placeholderText="Loading items…"
				getKey={(row) => stringify(row.entityId)}
				getSortValue={(row) => row.sortKey}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No RSS items here yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: row,
				})}
					{#if row}
						<RssItemView
							entityId={row.entityId}
							href={resolve('/(social)/(rss)/rss/item/[feedKey]/[guid]', {
								feedKey: encodeURIComponent(row.entityId.feedUrl),
								guid: encodeURIComponent(row.entityId.guid),
							})}
							layout={EntityLayout.Title}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
