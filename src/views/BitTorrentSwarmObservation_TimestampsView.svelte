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
		title = 'Bit torrent swarm observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentSwarmObservation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BitTorrentSwarmObservation_Timestamp>
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
	entityType={EntityType.BitTorrentSwarmObservation_Timestamp}
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
				peerCount: true,
				seedCount: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bitTorrentSwarmObservationTimestamps) => [...new Map(bitTorrentSwarmObservationTimestamps.values.map((bitTorrentSwarmObservationTimestamp) => [bitTorrentSwarmObservationTimestamp[EntityMetaKey.SelectorKey], bitTorrentSwarmObservationTimestamp])).values()]}
	getKey={(bitTorrentSwarmObservationTimestamp) => bitTorrentSwarmObservationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bit torrent swarm observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitTorrentSwarmObservationTimestamp })}
		{@const bitTorrentSwarmObservationTimestampFields = { ...bitTorrentSwarmObservationTimestamp[EntityMetaKey.Selector], ...bitTorrentSwarmObservationTimestamp }}
		<EntityView
			entityType={EntityType.BitTorrentSwarmObservation_Timestamp}
			entitySelector={bitTorrentSwarmObservationTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bitTorrentSwarmObservationTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'bit torrent swarm observation timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((bitTorrentSwarmObservationTimestampFields.peerCount) ?? ''), String((bitTorrentSwarmObservationTimestampFields.seedCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((bitTorrentSwarmObservationTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
