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
		title = 'Bit torrent DHT lookup observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentDhtLookup_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BitTorrentDhtLookup_Timestamp>
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
	entityType={EntityType.BitTorrentDhtLookup_Timestamp}
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
				infoHash: true,
				status: true,
				timestampMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bitTorrentDhtLookupTimestamps) => [...new Map(bitTorrentDhtLookupTimestamps.values.map((bitTorrentDhtLookupTimestamp) => [bitTorrentDhtLookupTimestamp[EntityMetaKey.SelectorKey], bitTorrentDhtLookupTimestamp])).values()]}
	getKey={(bitTorrentDhtLookupTimestamp) => bitTorrentDhtLookupTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bit torrent DHT lookup observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitTorrentDhtLookupTimestamp })}
		{@const bitTorrentDhtLookupTimestampFields = { ...bitTorrentDhtLookupTimestamp[EntityMetaKey.Selector], ...bitTorrentDhtLookupTimestamp }}
		<EntityView
			entityType={EntityType.BitTorrentDhtLookup_Timestamp}
			entitySelector={bitTorrentDhtLookupTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bitTorrentDhtLookupTimestampFields.infoHash) ?? '')].filter(Boolean).join(' ') || 'bit torrent DHT lookup timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((bitTorrentDhtLookupTimestampFields.status) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((bitTorrentDhtLookupTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
