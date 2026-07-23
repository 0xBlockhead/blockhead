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
		title = 'Eigen layer strategies',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerStrategies-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EigenLayerStrategy>
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
	entityType={EntityType.EigenLayerStrategy}
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
				strategyAddress: true,
				underlyingToken: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eigenLayerStrategies) => [...new Map(eigenLayerStrategies.values.map((eigenLayerStrategy) => [eigenLayerStrategy[EntityMetaKey.SelectorKey], eigenLayerStrategy])).values()]}
	getKey={(eigenLayerStrategy) => eigenLayerStrategy[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eigen layer strategies yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerStrategy })}
		{@const eigenLayerStrategyFields = { ...eigenLayerStrategy[EntityMetaKey.Selector], ...eigenLayerStrategy }}
		<EntityView
			entityType={EntityType.EigenLayerStrategy}
			entitySelector={eigenLayerStrategy[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((eigenLayerStrategyFields.strategyAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer strategy'}
			{/snippet}

			{#snippet Value()}
				{[String((eigenLayerStrategyFields.underlyingToken) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((eigenLayerStrategyFields.$network.name) ?? '')].filter(Boolean).join(' ') || [eigenLayerStrategyFields.$network.caip2 == null ? '' : String(`${(eigenLayerStrategyFields.$network.caip2).namespace}:${(eigenLayerStrategyFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
