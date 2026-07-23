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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BitTorrentPeer_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BitTorrentPeer_Timestamp}
			entitySelector={bitTorrentPeerTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bitTorrentPeerTimestampFields.peerId) ?? '')].filter(Boolean).join(' ') || 'bit torrent peer timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((bitTorrentPeerTimestampFields.client) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((bitTorrentPeerTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
