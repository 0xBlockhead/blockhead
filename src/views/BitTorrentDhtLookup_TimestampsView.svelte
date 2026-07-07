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
		title = 'Bit torrent DHT lookup observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentDhtLookup_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BitTorrentDhtLookup_Timestamp>
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
	import BitTorrentDhtLookup_TimestampView from '$/views/BitTorrentDhtLookup_TimestampView.svelte'
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
					infoHash: true,
					status: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitTorrentDhtLookup_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(bitTorrentDhtLookupTimestamps)}
			{@const uniqueBitTorrentDhtLookupTimestamps = [...new Map(bitTorrentDhtLookupTimestamps.values.map((bitTorrentDhtLookupTimestamp) => [bitTorrentDhtLookupTimestamp[EntityMetaKey.SelectorKey], bitTorrentDhtLookupTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitTorrentDhtLookup_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bitTorrentDhtLookupTimestamps.totalCount}
				getKey={(bitTorrentDhtLookupTimestamp) => bitTorrentDhtLookupTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBitTorrentDhtLookupTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bit torrent DHT lookup observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bitTorrentDhtLookupTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BitTorrentDhtLookup_Timestamp> })}
					{@const bitTorrentDhtLookupTimestampFields = { ...bitTorrentDhtLookupTimestamp[EntityMetaKey.Selector], ...bitTorrentDhtLookupTimestamp }}
					<BitTorrentDhtLookup_TimestampView
						selection={select(EntityType.BitTorrentDhtLookup_Timestamp, bitTorrentDhtLookupTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={bitTorrentDhtLookupTimestampFields}
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
		entityType={EntityType.BitTorrentDhtLookup_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
