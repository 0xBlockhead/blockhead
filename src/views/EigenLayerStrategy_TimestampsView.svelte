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
		title = 'Eigen layer strategy observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerStrategy_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EigenLayerStrategy_Timestamp>
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
	entityType={EntityType.EigenLayerStrategy_Timestamp}
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
				$strategy: true,
				timestampMs: true,
				totalShares: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eigenLayerStrategyTimestamps) => [...new Map(eigenLayerStrategyTimestamps.values.map((eigenLayerStrategyTimestamp) => [eigenLayerStrategyTimestamp[EntityMetaKey.SelectorKey], eigenLayerStrategyTimestamp])).values()]}
	getKey={(eigenLayerStrategyTimestamp) => eigenLayerStrategyTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eigen layer strategy observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerStrategyTimestamp })}
		{@const eigenLayerStrategyTimestampFields = { ...eigenLayerStrategyTimestamp[EntityMetaKey.Selector], ...eigenLayerStrategyTimestamp }}
		<EntityView
			entityType={EntityType.EigenLayerStrategy_Timestamp}
			entitySelector={eigenLayerStrategyTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((eigenLayerStrategyTimestampFields.$strategy.strategyAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer strategy'].filter(Boolean).join(' ') || 'eigen layer strategy timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((eigenLayerStrategyTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((eigenLayerStrategyTimestampFields.totalShares) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
