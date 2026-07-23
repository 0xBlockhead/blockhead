<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'Bit torrent tracker scrape observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentTrackerScrape_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BitTorrentTrackerScrape_Timestamp>
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
	entityType={EntityType.BitTorrentTrackerScrape_Timestamp}
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
				timestampMs: true,
				status: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bitTorrentTrackerScrapeTimestamps) => [...new Map(bitTorrentTrackerScrapeTimestamps.values.map((bitTorrentTrackerScrapeTimestamp) => [bitTorrentTrackerScrapeTimestamp[EntityMetaKey.SelectorKey], bitTorrentTrackerScrapeTimestamp])).values()]}
	getKey={(bitTorrentTrackerScrapeTimestamp) => bitTorrentTrackerScrapeTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bit torrent tracker scrape observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitTorrentTrackerScrapeTimestamp })}
		{@const bitTorrentTrackerScrapeTimestampFields = { ...bitTorrentTrackerScrapeTimestamp[EntityMetaKey.Selector], ...bitTorrentTrackerScrapeTimestamp }}
		<EntityView
			entityType={EntityType.BitTorrentTrackerScrape_Timestamp}
			entitySelector={bitTorrentTrackerScrapeTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bitTorrentTrackerScrapeTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'bit torrent tracker scrape timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((bitTorrentTrackerScrapeTimestampFields.status) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((bitTorrentTrackerScrapeTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
