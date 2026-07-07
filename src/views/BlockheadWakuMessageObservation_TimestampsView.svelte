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
		title = 'Blockhead Waku message observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWakuMessageObservation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadWakuMessageObservation_Timestamp>
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
	import BlockheadWakuMessageObservation_TimestampView from '$/views/BlockheadWakuMessageObservation_TimestampView.svelte'
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
					messageHash: true,
					timestampMs: true,
					contentTopic: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadWakuMessageObservationTimestamps)}
			{@const uniqueBlockheadWakuMessageObservationTimestamps = [...new Map(blockheadWakuMessageObservationTimestamps.values.map((blockheadWakuMessageObservationTimestamp) => [blockheadWakuMessageObservationTimestamp[EntityMetaKey.SelectorKey], blockheadWakuMessageObservationTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadWakuMessageObservationTimestamps.totalCount}
				getKey={(blockheadWakuMessageObservationTimestamp) => blockheadWakuMessageObservationTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadWakuMessageObservationTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead waku message observation observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadWakuMessageObservationTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadWakuMessageObservation_Timestamp> })}
					{@const blockheadWakuMessageObservationTimestampFields = { ...blockheadWakuMessageObservationTimestamp[EntityMetaKey.Selector], ...blockheadWakuMessageObservationTimestamp }}
					<BlockheadWakuMessageObservation_TimestampView
						selection={select(EntityType.BlockheadWakuMessageObservation_Timestamp, blockheadWakuMessageObservationTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadWakuMessageObservationTimestampFields}
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
		entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
