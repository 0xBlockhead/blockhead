<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Eigen layer allocation observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerAllocation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EigenLayerAllocation_Timestamp>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EigenLayerAllocation_TimestampView from '$/views/EigenLayerAllocation_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerAllocation_Timestamp}
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
				$operator: true,
				$avs: true,
				$strategy: true,
			},
		})
	}
	getResourceItems={(eigenLayerAllocationTimestamps) => [...new Map(eigenLayerAllocationTimestamps.values.map((eigenLayerAllocationTimestamp) => [eigenLayerAllocationTimestamp[EntityMetaKey.SelectorKey], eigenLayerAllocationTimestamp])).values()]}
	getKey={(eigenLayerAllocationTimestamp) => eigenLayerAllocationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eigen layer allocation observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerAllocationTimestamp })}
		{@const eigenLayerAllocationTimestampFields = { ...eigenLayerAllocationTimestamp[EntityMetaKey.Selector], ...eigenLayerAllocationTimestamp }}
		{@const selection = select(EntityType.EigenLayerAllocation_Timestamp, eigenLayerAllocationTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<EigenLayerAllocation_TimestampView
			selection={selection}
			prefetched={eigenLayerAllocationTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
