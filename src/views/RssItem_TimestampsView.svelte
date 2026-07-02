<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'RSS item observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading RSS item observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RssItem_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RssItem_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
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
	import RssItem_TimestampView from '$/views/RssItem_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					$item: true,
					timestampMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RssItem_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(rssItemTimestamps)}
			{@const uniqueRssItemTimestamps = [...new Map(rssItemTimestamps.values.map((rssItemTimestamp) => [rssItemTimestamp[EntityMetaKey.SelectorKey], rssItemTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RssItem_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={rssItemTimestamps.values.length === uniqueRssItemTimestamps.length && rssItemTimestamps.totalCount != null && rssItemTimestamps.totalCount >= uniqueRssItemTimestamps.length ? rssItemTimestamps.totalCount : uniqueRssItemTimestamps.length}
				getKey={(rssItemTimestamp) => rssItemTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueRssItemTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No RSS item observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: rssItemTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.RssItem_Timestamp> })}
					<RssItem_TimestampView
						href={
							resolve('/(social)/(rss)/rss/item/[feedKey]/[guid]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								feedKey: String(rssItemTimestamp.entitySelector.$rssItemTimestamp.feedUrl),
								guid: String(rssItemTimestamp.entitySelector.$rssItemTimestamp.guid),
								timestampMs: String(rssItemTimestamp.entitySelector.timestampMs),
								source: String(rssItemTimestamp.entitySelector.source),
							})
						}
						selection={select(EntityType.RssItem_Timestamp, rssItemTimestamp.entitySelector)}
						prefetched={rssItemTimestamp}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.RssItem_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
