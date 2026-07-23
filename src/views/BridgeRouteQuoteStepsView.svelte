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
		title = 'Quote steps',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BridgeRouteQuoteSteps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BridgeRouteQuoteStep>
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
	entityType={EntityType.BridgeRouteQuoteStep}
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
				indexInQuote: true,
				tool: true,
				stepType: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bridgeRouteQuoteSteps) => [...new Map(bridgeRouteQuoteSteps.values.map((bridgeRouteQuoteStep) => [bridgeRouteQuoteStep[EntityMetaKey.SelectorKey], bridgeRouteQuoteStep])).values()]}
	getKey={(bridgeRouteQuoteStep) => bridgeRouteQuoteStep[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bridge route quote steps yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bridgeRouteQuoteStep })}
		{@const bridgeRouteQuoteStepFields = { ...bridgeRouteQuoteStep[EntityMetaKey.Selector], ...bridgeRouteQuoteStep }}
		<EntityView
			entityType={EntityType.BridgeRouteQuoteStep}
			entitySelector={bridgeRouteQuoteStep[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{(String((bridgeRouteQuoteStepFields.indexInQuote) ?? '') ? 'Step #' + String((bridgeRouteQuoteStepFields.indexInQuote) ?? '') : '') || 'bridge route quote step'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((bridgeRouteQuoteStepFields.tool) ?? ''), String((bridgeRouteQuoteStepFields.stepType) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
