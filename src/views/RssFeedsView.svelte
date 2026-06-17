<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
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
			collapsible?: boolean
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
			RSS / Atom feed entities keyed by feedUrl; this rssFeeds is seeded from Constants.
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
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
					{
						sources: [Source.Constants_Internal],
					}
				).field(entityFieldReference.fieldName, {
					sources: [Source.Constants_Internal],
				})} placeholderText="Loading feeds…">
				{#snippet children(feeds)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.RssFeed}
				{id}
				{title}
				getKey={(feed) => stringify(feed.__selector)}
				getSortValue={(feed) => feed.__selector.feedUrl}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No RSS feeds in this hub yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<RssFeedView
						selector={item.__selector}
						layout={EntityLayout.SummaryDetails}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
