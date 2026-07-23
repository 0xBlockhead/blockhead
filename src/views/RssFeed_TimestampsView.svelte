<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RssFeed_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RssFeed_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				$feed: {
					fields: {
						title: true,
						lastBuildDate: true,
					},
				},
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(rssFeedTimestamps) => [...new Map(rssFeedTimestamps.values.map((rssFeedTimestamp) => [rssFeedTimestamp[EntityMetaKey.SelectorKey], rssFeedTimestamp])).values()]}
	getKey={(rssFeedTimestamp) => rssFeedTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
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
		<EntityView
			entityType={EntityType.RssFeed_Timestamp}
			entitySelector={rssFeedTimestamp[EntityMetaKey.Selector]}
			href={
				(
					rssFeedTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in rssFeedTimestamp[EntityMetaKey.Selector]
					&& rssFeedTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& rssFeedTimestamp[EntityMetaKey.Selector] != null && 'source' in rssFeedTimestamp[EntityMetaKey.Selector]
					&& rssFeedTimestamp[EntityMetaKey.Selector].source != null
					&& rssFeedTimestamp[EntityMetaKey.Selector] != null && '$feed' in rssFeedTimestamp[EntityMetaKey.Selector]
					&& rssFeedTimestamp[EntityMetaKey.Selector].$feed != null && 'feedUrl' in rssFeedTimestamp[EntityMetaKey.Selector].$feed
					&& rssFeedTimestamp[EntityMetaKey.Selector].$feed.feedUrl != null ?
						resolve('/rss/feed/[feedUrl=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(rssFeedTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(rssFeedTimestamp[EntityMetaKey.Selector].source ?? ''),
					feedUrl: encodeURIComponent(String(rssFeedTimestamp[EntityMetaKey.Selector].$feed.feedUrl ?? '')),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((rssFeedTimestampFields.$feed.title) ?? ''), String((rssFeedTimestampFields.$feed.feedUrl) ?? '')].filter(Boolean).join(' ') || 'RSS feed'].filter(Boolean).join(' ') || 'RSS feed observation'}
			{/snippet}

			{#snippet Value()}
				{[String((rssFeedTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
