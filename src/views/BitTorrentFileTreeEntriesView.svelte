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
		title = 'Bit torrent file tree entries',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentFileTreeEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BitTorrentFileTreeEntry>
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
	import BitTorrentFileTreeEntryView from '$/views/BitTorrentFileTreeEntryView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentFileTreeEntry}
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
				path: true,
				entryKind: true,
			},
		})
	}
	getResourceItems={(bitTorrentFileTreeEntries) => [...new Map(bitTorrentFileTreeEntries.values.map((bitTorrentFileTreeEntry) => [bitTorrentFileTreeEntry[EntityMetaKey.SelectorKey], bitTorrentFileTreeEntry])).values()]}
	getKey={(bitTorrentFileTreeEntry) => bitTorrentFileTreeEntry[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bit torrent file tree entries yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitTorrentFileTreeEntry })}
		{@const bitTorrentFileTreeEntryFields = { ...bitTorrentFileTreeEntry[EntityMetaKey.Selector], ...bitTorrentFileTreeEntry }}
		{@const selection = select(EntityType.BitTorrentFileTreeEntry, bitTorrentFileTreeEntry[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BitTorrentFileTreeEntryView
			selection={selection}
			prefetched={bitTorrentFileTreeEntryFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
