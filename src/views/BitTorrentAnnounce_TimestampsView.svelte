<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Bit torrent announce observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentAnnounce_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BitTorrentAnnounce_Timestamp>
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
	import BitTorrentAnnounce_TimestampView from '$/views/BitTorrentAnnounce_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentAnnounce_Timestamp}
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
	getResourceItems={(bitTorrentAnnounceTimestamps) => [...new Map(bitTorrentAnnounceTimestamps.values.map((bitTorrentAnnounceTimestamp) => [bitTorrentAnnounceTimestamp[EntityMetaKey.SelectorKey], bitTorrentAnnounceTimestamp])).values()]}
	getKey={(bitTorrentAnnounceTimestamp) => bitTorrentAnnounceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bit torrent announce observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitTorrentAnnounceTimestamp })}
		{@const bitTorrentAnnounceTimestampFields = { ...bitTorrentAnnounceTimestamp[EntityMetaKey.Selector], ...bitTorrentAnnounceTimestamp }}
		{@const selection = select(EntityType.BitTorrentAnnounce_Timestamp, bitTorrentAnnounceTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BitTorrentAnnounce_TimestampView
			selection={selection}
			prefetched={bitTorrentAnnounceTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
