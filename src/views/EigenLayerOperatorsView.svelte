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
		title = 'Eigen layer operators',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerOperators-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EigenLayerOperator>
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
	entityType={EntityType.EigenLayerOperator}
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
				operatorAddress: true,
				name: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eigenLayerOperators) => [...new Map(eigenLayerOperators.values.map((eigenLayerOperator) => [eigenLayerOperator[EntityMetaKey.SelectorKey], eigenLayerOperator])).values()]}
	getKey={(eigenLayerOperator) => eigenLayerOperator[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eigen layer operators yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerOperator })}
		{@const eigenLayerOperatorFields = { ...eigenLayerOperator[EntityMetaKey.Selector], ...eigenLayerOperator }}
		<EntityView
			entityType={EntityType.EigenLayerOperator}
			entitySelector={eigenLayerOperator[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((eigenLayerOperatorFields.operatorAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer operator'}
			{/snippet}

			{#snippet Value()}
				{[String((eigenLayerOperatorFields.name) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((eigenLayerOperatorFields.$network.name) ?? '')].filter(Boolean).join(' ') || [eigenLayerOperatorFields.$network.caip2 == null ? '' : String(`${(eigenLayerOperatorFields.$network.caip2).namespace}:${(eigenLayerOperatorFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
