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
		title = 'Blockhead Radicle seed observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadRadicleSeedObservation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadRadicleSeedObservation_Timestamp>
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
	import BlockheadRadicleSeedObservation_TimestampView from '$/views/BlockheadRadicleSeedObservation_TimestampView.svelte'
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
					timestampMs: true,
					$repository: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadRadicleSeedObservation_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadRadicleSeedObservationTimestamps)}
			{@const uniqueBlockheadRadicleSeedObservationTimestamps = [...new Map(blockheadRadicleSeedObservationTimestamps.values.map((blockheadRadicleSeedObservationTimestamp) => [blockheadRadicleSeedObservationTimestamp[EntityMetaKey.SelectorKey], blockheadRadicleSeedObservationTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadRadicleSeedObservation_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadRadicleSeedObservationTimestamps.totalCount}
				getKey={(blockheadRadicleSeedObservationTimestamp) => blockheadRadicleSeedObservationTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadRadicleSeedObservationTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead radicle seed observation observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadRadicleSeedObservationTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadRadicleSeedObservation_Timestamp> })}
					{@const blockheadRadicleSeedObservationTimestampFields = { ...blockheadRadicleSeedObservationTimestamp[EntityMetaKey.Selector], ...blockheadRadicleSeedObservationTimestamp }}
					<BlockheadRadicleSeedObservation_TimestampView
						selection={select(EntityType.BlockheadRadicleSeedObservation_Timestamp, blockheadRadicleSeedObservationTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadRadicleSeedObservationTimestampFields}
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
		entityType={EntityType.BlockheadRadicleSeedObservation_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
