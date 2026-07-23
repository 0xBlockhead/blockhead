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
		title = 'RSS item observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RssItem_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RssItem_Timestamp>
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
	entityType={EntityType.RssItem_Timestamp}
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
				$item: {
					fields: {
						title: true,
						publishedAt: true,
					},
				},
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(rssItemTimestamps) => [...new Map(rssItemTimestamps.values.map((rssItemTimestamp) => [rssItemTimestamp[EntityMetaKey.SelectorKey], rssItemTimestamp])).values()]}
	getKey={(rssItemTimestamp) => rssItemTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No RSS item observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: rssItemTimestamp })}
		{@const rssItemTimestampFields = { ...rssItemTimestamp[EntityMetaKey.Selector], ...rssItemTimestamp }}
		<EntityView
			entityType={EntityType.RssItem_Timestamp}
			entitySelector={rssItemTimestamp[EntityMetaKey.Selector]}
			href={
				(
					rssItemTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in rssItemTimestamp[EntityMetaKey.Selector]
					&& rssItemTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& rssItemTimestamp[EntityMetaKey.Selector] != null && 'source' in rssItemTimestamp[EntityMetaKey.Selector]
					&& rssItemTimestamp[EntityMetaKey.Selector].source != null
					&& rssItemTimestamp[EntityMetaKey.Selector] != null && '$item' in rssItemTimestamp[EntityMetaKey.Selector]
					&& rssItemTimestamp[EntityMetaKey.Selector].$item != null && 'itemIdentityKind' in rssItemTimestamp[EntityMetaKey.Selector].$item
					&& rssItemTimestamp[EntityMetaKey.Selector].$item.itemIdentityKind != null
					&& rssItemTimestamp[EntityMetaKey.Selector].$item != null && 'itemIdentity' in rssItemTimestamp[EntityMetaKey.Selector].$item
					&& rssItemTimestamp[EntityMetaKey.Selector].$item.itemIdentity != null
					&& rssItemTimestamp[EntityMetaKey.Selector].$item != null && '$feed' in rssItemTimestamp[EntityMetaKey.Selector].$item
					&& rssItemTimestamp[EntityMetaKey.Selector].$item.$feed != null && 'feedUrl' in rssItemTimestamp[EntityMetaKey.Selector].$item.$feed
					&& rssItemTimestamp[EntityMetaKey.Selector].$item.$feed.feedUrl != null ?
						resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(rssItemTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(rssItemTimestamp[EntityMetaKey.Selector].source ?? ''),
					itemIdentityKind: String(rssItemTimestamp[EntityMetaKey.Selector].$item.itemIdentityKind ?? ''),
					itemIdentity: encodeURIComponent(String(rssItemTimestamp[EntityMetaKey.Selector].$item.itemIdentity ?? '')),
					feedUrl: encodeURIComponent(String(rssItemTimestamp[EntityMetaKey.Selector].$item.$feed.feedUrl ?? '')),
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
				{[[String((rssItemTimestampFields.$item.title) ?? ''), String((rssItemTimestampFields.$item.itemIdentity) ?? '')].filter(Boolean).join(' ') || 'RSS item'].filter(Boolean).join(' ') || 'RSS item observation'}
			{/snippet}

			{#snippet Value()}
				{[String((rssItemTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
