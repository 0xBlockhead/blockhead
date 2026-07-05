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
		title = 'Eigen layer allocation observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerAllocation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EigenLayerAllocation_Timestamp>
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
	import EigenLayerAllocation_TimestampView from '$/views/EigenLayerAllocation_TimestampView.svelte'
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
					$operator: true,
					$avs: true,
					$strategy: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(eigenLayerAllocationTimestamps)}
			{@const uniqueEigenLayerAllocationTimestamps = [...new Map(eigenLayerAllocationTimestamps.values.map((eigenLayerAllocationTimestamp) => [eigenLayerAllocationTimestamp[EntityMetaKey.SelectorKey], eigenLayerAllocationTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EigenLayerAllocation_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={eigenLayerAllocationTimestamps.totalCount}
				getKey={(eigenLayerAllocationTimestamp) => eigenLayerAllocationTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEigenLayerAllocationTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Eigen layer allocation observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: eigenLayerAllocationTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EigenLayerAllocation_Timestamp> })}
					{@const eigenLayerAllocationTimestampFields = { ...eigenLayerAllocationTimestamp[EntityMetaKey.Selector], ...eigenLayerAllocationTimestamp }}
					<EigenLayerAllocation_TimestampView
						selection={select(EntityType.EigenLayerAllocation_Timestamp, eigenLayerAllocationTimestamp[EntityMetaKey.Selector])}
						prefetched={eigenLayerAllocationTimestampFields}
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
		entityType={EntityType.EigenLayerAllocation_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
