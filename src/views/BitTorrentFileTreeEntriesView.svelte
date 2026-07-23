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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BitTorrentFileTreeEntry>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BitTorrentFileTreeEntry}
			entitySelector={bitTorrentFileTreeEntry[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bitTorrentFileTreeEntryFields.path) ?? '')].filter(Boolean).join(' ') || 'bit torrent file tree entry'}
			{/snippet}

			{#snippet Value()}
				{[String((bitTorrentFileTreeEntryFields.entryKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
