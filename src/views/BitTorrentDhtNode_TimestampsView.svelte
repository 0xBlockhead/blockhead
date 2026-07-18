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
		title = 'Bit torrent DHT node observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentDhtNode_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BitTorrentDhtNode_Timestamp>
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
	import BitTorrentDhtNode_TimestampView from '$/views/BitTorrentDhtNode_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentDhtNode_Timestamp}
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
				nodeId: true,
				reachable: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(bitTorrentDhtNodeTimestamps) => [...new Map(bitTorrentDhtNodeTimestamps.values.map((bitTorrentDhtNodeTimestamp) => [bitTorrentDhtNodeTimestamp[EntityMetaKey.SelectorKey], bitTorrentDhtNodeTimestamp])).values()]}
	getKey={(bitTorrentDhtNodeTimestamp) => bitTorrentDhtNodeTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bit torrent DHT node observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitTorrentDhtNodeTimestamp })}
		{@const bitTorrentDhtNodeTimestampFields = { ...bitTorrentDhtNodeTimestamp[EntityMetaKey.Selector], ...bitTorrentDhtNodeTimestamp }}
		{@const selection = select(EntityType.BitTorrentDhtNode_Timestamp, bitTorrentDhtNodeTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BitTorrentDhtNode_TimestampView
			selection={selection}
			prefetched={bitTorrentDhtNodeTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
