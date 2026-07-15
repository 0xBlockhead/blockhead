<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'RSS feed observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RssFeed_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.RssFeed_Timestamp>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RssFeed_TimestampView from '$/views/RssFeed_TimestampView.svelte'
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
					$feed: true,
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
				entityType={EntityType.RssFeed_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(rssFeedTimestamps)}
			{@const uniqueRssFeedTimestamps = [...new Map(rssFeedTimestamps.values.map((rssFeedTimestamp) => [rssFeedTimestamp[EntityMetaKey.SelectorKey], rssFeedTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RssFeed_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={rssFeedTimestamps.totalCount}
				getKey={(rssFeedTimestamp) => rssFeedTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueRssFeedTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No RSS feed observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: rssFeedTimestamp })}
					{@const rssFeedTimestampFields = { ...rssFeedTimestamp[EntityMetaKey.Selector], ...rssFeedTimestamp }}
					{@const selection = select(EntityType.RssFeed_Timestamp, rssFeedTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const rssFeedTimestampHrefFields = { ...rssFeedTimestamp, ...rssFeedTimestamp[EntityMetaKey.Selector] }}
					<RssFeed_TimestampView
						selection={selection}
						prefetched={rssFeedTimestampFields}
						href={
							(rssFeedTimestampHrefFields.timestampMs !== undefined && rssFeedTimestampHrefFields.source !== undefined && rssFeedTimestampHrefFields.$feed !== undefined && rssFeedTimestampHrefFields.$feed.feedUrl !== undefined ? resolve('/rss/feed/[feedUrl=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(rssFeedTimestampHrefFields.timestampMs ?? ''),
								source: String(rssFeedTimestampHrefFields.source ?? ''),
								feedUrl: String(rssFeedTimestampHrefFields.$feed.feedUrl ?? ''),
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
		entityType={EntityType.RssFeed_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
