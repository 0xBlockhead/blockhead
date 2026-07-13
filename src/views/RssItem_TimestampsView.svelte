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
		placeholderText,
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
			selection({
				fields: {
					$item: true,
					timestampMs: true,
					source: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={rssItemTimestamps.totalCount}
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
					{@const rssItemTimestampFields = { ...rssItemTimestamp[EntityMetaKey.Selector], ...rssItemTimestamp }}
					{@const rssItemTimestampHrefFields = { ...rssItemTimestamp, ...rssItemTimestamp[EntityMetaKey.Selector] }}
					<RssItem_TimestampView
						selection={select(EntityType.RssItem_Timestamp, rssItemTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={rssItemTimestampFields}
						href={
							(rssItemTimestampHrefFields.timestampMs !== undefined && rssItemTimestampHrefFields.source !== undefined && rssItemTimestampHrefFields.$item !== undefined && rssItemTimestampHrefFields.$item.feedUrl !== undefined && rssItemTimestampHrefFields.$item.guid !== undefined ? resolve('/rss/item/[feedKey=stringSegment]/[guid=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(rssItemTimestampHrefFields.timestampMs ?? ''),
								source: String(rssItemTimestampHrefFields.source ?? ''),
								feedKey: String(rssItemTimestampHrefFields.$item.feedUrl ?? ''),
								guid: String(rssItemTimestampHrefFields.$item.guid ?? ''),
							}) : undefined)
						}
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
