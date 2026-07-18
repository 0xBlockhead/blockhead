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
		title = 'Bit torrent peer observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentPeer_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BitTorrentPeer_Timestamp>
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
	import BitTorrentPeer_TimestampView from '$/views/BitTorrentPeer_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentPeer_Timestamp}
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
				peerId: true,
				client: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(bitTorrentPeerTimestamps) => [...new Map(bitTorrentPeerTimestamps.values.map((bitTorrentPeerTimestamp) => [bitTorrentPeerTimestamp[EntityMetaKey.SelectorKey], bitTorrentPeerTimestamp])).values()]}
	getKey={(bitTorrentPeerTimestamp) => bitTorrentPeerTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bit torrent peer observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitTorrentPeerTimestamp })}
		{@const bitTorrentPeerTimestampFields = { ...bitTorrentPeerTimestamp[EntityMetaKey.Selector], ...bitTorrentPeerTimestamp }}
		{@const selection = select(EntityType.BitTorrentPeer_Timestamp, bitTorrentPeerTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BitTorrentPeer_TimestampView
			selection={selection}
			prefetched={bitTorrentPeerTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
