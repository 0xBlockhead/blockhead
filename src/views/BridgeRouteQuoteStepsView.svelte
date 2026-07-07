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
		title = 'Quote steps',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BridgeRouteQuoteSteps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BridgeRouteQuoteStep>
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
	import BridgeRouteQuoteStepView from '$/views/BridgeRouteQuoteStepView.svelte'
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
					indexInQuote: true,
					tool: true,
					stepType: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BridgeRouteQuoteStep}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(bridgeRouteQuoteSteps)}
			{@const uniqueBridgeRouteQuoteSteps = [...new Map(bridgeRouteQuoteSteps.values.map((bridgeRouteQuoteStep) => [bridgeRouteQuoteStep[EntityMetaKey.SelectorKey], bridgeRouteQuoteStep])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BridgeRouteQuoteStep}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bridgeRouteQuoteSteps.totalCount}
				getKey={(bridgeRouteQuoteStep) => bridgeRouteQuoteStep[EntityMetaKey.SelectorKey]}
				items={uniqueBridgeRouteQuoteSteps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bridge route quote steps yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bridgeRouteQuoteStep }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BridgeRouteQuoteStep> })}
					{@const bridgeRouteQuoteStepFields = { ...bridgeRouteQuoteStep[EntityMetaKey.Selector], ...bridgeRouteQuoteStep }}
					<BridgeRouteQuoteStepView
						selection={select(EntityType.BridgeRouteQuoteStep, bridgeRouteQuoteStep[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={bridgeRouteQuoteStepFields}
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
		entityType={EntityType.BridgeRouteQuoteStep}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
