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
		title = 'Bit torrent DHT node observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentDhtNode_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BitTorrentDhtNode_Timestamp>
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
	import BitTorrentDhtNode_TimestampView from '$/views/BitTorrentDhtNode_TimestampView.svelte'
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
					nodeId: true,
					reachable: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(bitTorrentDhtNodeTimestamps)}
			{@const uniqueBitTorrentDhtNodeTimestamps = [...new Map(bitTorrentDhtNodeTimestamps.values.map((bitTorrentDhtNodeTimestamp) => [bitTorrentDhtNodeTimestamp[EntityMetaKey.SelectorKey], bitTorrentDhtNodeTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitTorrentDhtNode_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bitTorrentDhtNodeTimestamps.totalCount}
				getKey={(bitTorrentDhtNodeTimestamp) => bitTorrentDhtNodeTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBitTorrentDhtNodeTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bit torrent DHT node observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bitTorrentDhtNodeTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BitTorrentDhtNode_Timestamp> })}
					{@const bitTorrentDhtNodeTimestampFields = { ...bitTorrentDhtNodeTimestamp[EntityMetaKey.Selector], ...bitTorrentDhtNodeTimestamp }}
					<BitTorrentDhtNode_TimestampView
						selection={select(EntityType.BitTorrentDhtNode_Timestamp, bitTorrentDhtNodeTimestamp[EntityMetaKey.Selector])}
						prefetched={bitTorrentDhtNodeTimestampFields}
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
		entityType={EntityType.BitTorrentDhtNode_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
