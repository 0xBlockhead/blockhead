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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EigenLayerAllocation_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.EigenLayerAllocation_Timestamp}
			entitySelector={eigenLayerAllocationTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((eigenLayerAllocationTimestampFields.$operator.operatorAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer operator'].filter(Boolean).join(' ') || 'eigen layer allocation timestamp'}
			{/snippet}

			{#snippet Value()}
				{[[String((eigenLayerAllocationTimestampFields.$avs.avsAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer avs'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((eigenLayerAllocationTimestampFields.$strategy.strategyAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer strategy'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
