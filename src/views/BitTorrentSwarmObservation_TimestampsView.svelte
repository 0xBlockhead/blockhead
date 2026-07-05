<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Bit torrent swarm observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentSwarmObservation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BitTorrentSwarmObservation_Timestamp>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BitTorrentSwarmObservation_TimestampView from '$/views/BitTorrentSwarmObservation_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					timestampMs: true,
					peerCount: true,
					seedCount: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(bitTorrentSwarmObservationTimestamps)}
			{@const uniqueBitTorrentSwarmObservationTimestamps = [...new Map(bitTorrentSwarmObservationTimestamps.values.map((bitTorrentSwarmObservationTimestamp) => [bitTorrentSwarmObservationTimestamp[EntityMetaKey.SelectorKey], bitTorrentSwarmObservationTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitTorrentSwarmObservation_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bitTorrentSwarmObservationTimestamps.totalCount}
				getKey={(bitTorrentSwarmObservationTimestamp) => bitTorrentSwarmObservationTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBitTorrentSwarmObservationTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bit torrent swarm observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bitTorrentSwarmObservationTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BitTorrentSwarmObservation_Timestamp> })}
					{@const bitTorrentSwarmObservationTimestampFields = { ...bitTorrentSwarmObservationTimestamp[EntityMetaKey.Selector], ...bitTorrentSwarmObservationTimestamp }}
					<BitTorrentSwarmObservation_TimestampView
						selection={select(EntityType.BitTorrentSwarmObservation_Timestamp, bitTorrentSwarmObservationTimestamp[EntityMetaKey.Selector])}
						prefetched={bitTorrentSwarmObservationTimestampFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BitTorrentSwarmObservation_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
