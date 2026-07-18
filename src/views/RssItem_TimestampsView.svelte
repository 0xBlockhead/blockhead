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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.RssItem_Timestamp>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RssItem_TimestampView from '$/views/RssItem_TimestampView.svelte'
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
				$item: true,
				timestampMs: true,
				source: true,
			},
		})
	}
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
		{@const selection = select(EntityType.RssItem_Timestamp, rssItemTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const rssItemTimestampHrefFields = { ...rssItemTimestamp, ...rssItemTimestamp[EntityMetaKey.Selector] }}
		<RssItem_TimestampView
			selection={selection}
			prefetched={rssItemTimestampFields}
			href={
				(rssItemTimestampHrefFields.timestampMs !== undefined && rssItemTimestampHrefFields.source !== undefined && rssItemTimestampHrefFields.$item !== undefined && rssItemTimestampHrefFields.$item.itemIdentityKind !== undefined && rssItemTimestampHrefFields.$item.itemIdentity !== undefined && rssItemTimestampHrefFields.$item.$feed !== undefined && rssItemTimestampHrefFields.$item.$feed.feedUrl !== undefined ? resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(rssItemTimestampHrefFields.timestampMs ?? ''),
					source: String(rssItemTimestampHrefFields.source ?? ''),
					itemIdentityKind: String(rssItemTimestampHrefFields.$item.itemIdentityKind ?? ''),
					itemIdentity: encodeURIComponent(String(rssItemTimestampHrefFields.$item.itemIdentity ?? '')),
					feedUrl: encodeURIComponent(String(rssItemTimestampHrefFields.$item.$feed.feedUrl ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
