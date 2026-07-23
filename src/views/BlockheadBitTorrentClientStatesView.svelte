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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadBitTorrentClientState>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BlockheadBitTorrentClientState}
			entitySelector={blockheadBitTorrentClientState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadBitTorrentClientStateFields.clientName) ?? '')].filter(Boolean).join(' ') || [String((blockheadBitTorrentClientStateFields.clientId) ?? '')].filter(Boolean).join(' ') || 'blockhead bit torrent client state'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadBitTorrentClientStateFields.peerId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
