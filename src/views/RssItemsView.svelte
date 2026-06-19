<script lang="ts">
	// Types/constants
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
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
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RssItem>
			id?: string
			limit?: number
			open?: boolean
			collapsible?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			<ResourceBoundary resource={selection({
					sources: [
						Source.Rss_Rest,
					],
					limit,
				})} placeholderText="Loading items…">
				{#snippet children(rssItems)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.RssItem}
						id={`${id}-items`}
						{title}
						open={true}
						items={rssItems.entities}
						getKey={(rssItem) => stringify(rssItem.entitySelector)}
						getSortValue={(rssItem) => stringify(rssItem.entitySelector)}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No RSS items here yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<a
								href={resolve('/(social)/(rss)/rss/item/[feedKey]/[guid]', {
									feedKey: encodeURIComponent(item.entitySelector.feedUrl),
									guid: encodeURIComponent(item.entitySelector.guid),
								})}
							>
								<TruncatedValue
									value={item.entitySelector.guid}
									format={TruncatedValueFormat.Visual}
								/>
							</a>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
