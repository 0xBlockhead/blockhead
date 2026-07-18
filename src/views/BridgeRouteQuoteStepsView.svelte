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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BridgeRouteQuoteStep>
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
	import BridgeRouteQuoteStepView from '$/views/BridgeRouteQuoteStepView.svelte'
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
		{@const selection = select(EntityType.BridgeRouteQuoteStep, bridgeRouteQuoteStep[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BridgeRouteQuoteStepView
			selection={selection}
			prefetched={bridgeRouteQuoteStepFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
