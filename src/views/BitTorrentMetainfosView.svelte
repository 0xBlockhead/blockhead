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
		title = 'Bit torrent metainfos',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentMetainfos-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BitTorrentMetainfo>
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
	entityType={EntityType.BitTorrentMetainfo}
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
				name: true,
				hashVersion: true,
				infoHash: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bitTorrentMetainfos) => [...new Map(bitTorrentMetainfos.values.map((bitTorrentMetainfo) => [bitTorrentMetainfo[EntityMetaKey.SelectorKey], bitTorrentMetainfo])).values()]}
	getKey={(bitTorrentMetainfo) => bitTorrentMetainfo[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bit torrent metainfos yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitTorrentMetainfo })}
		{@const bitTorrentMetainfoFields = { ...bitTorrentMetainfo[EntityMetaKey.Selector], ...bitTorrentMetainfo }}
		<EntityView
			entityType={EntityType.BitTorrentMetainfo}
			entitySelector={bitTorrentMetainfo[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bitTorrentMetainfoFields.name) ?? '')].filter(Boolean).join(' ') || [String((bitTorrentMetainfoFields.infoHash) ?? '')].filter(Boolean).join(' ') || 'bit torrent metainfo'}
			{/snippet}

			{#snippet Value()}
				{[String((bitTorrentMetainfoFields.hashVersion) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
