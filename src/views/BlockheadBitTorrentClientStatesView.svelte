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
		title = 'Blockhead bit torrent client states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadBitTorrentClientStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadBitTorrentClientState>
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
	import BlockheadBitTorrentClientStateView from '$/views/BlockheadBitTorrentClientStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadBitTorrentClientState}
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
				clientName: true,
				peerId: true,
				clientId: true,
			},
		})
	}
	getResourceItems={(blockheadBitTorrentClientStates) => [...new Map(blockheadBitTorrentClientStates.values.map((blockheadBitTorrentClientState) => [blockheadBitTorrentClientState[EntityMetaKey.SelectorKey], blockheadBitTorrentClientState])).values()]}
	getKey={(blockheadBitTorrentClientState) => blockheadBitTorrentClientState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead bit torrent client states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadBitTorrentClientState })}
		{@const blockheadBitTorrentClientStateFields = { ...blockheadBitTorrentClientState[EntityMetaKey.Selector], ...blockheadBitTorrentClientState }}
		{@const selection = select(EntityType.BlockheadBitTorrentClientState, blockheadBitTorrentClientState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadBitTorrentClientStateView
			selection={selection}
			prefetched={blockheadBitTorrentClientStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
