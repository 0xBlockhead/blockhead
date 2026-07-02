<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'Steps',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Bridge route steps...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BridgeRouteSteps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BridgeRouteStep>
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
	import BridgeRouteStepView from '$/views/BridgeRouteStepView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					indexInRoute: true,
					tool: true,
					stepType: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BridgeRouteStep}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(bridgeRouteSteps)}
			{@const uniqueBridgeRouteSteps = [...new Map(bridgeRouteSteps.values.map((bridgeRouteStep) => [bridgeRouteStep[EntityMetaKey.SelectorKey], bridgeRouteStep])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BridgeRouteStep}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bridgeRouteSteps.values.length === uniqueBridgeRouteSteps.length && bridgeRouteSteps.totalCount != null && bridgeRouteSteps.totalCount >= uniqueBridgeRouteSteps.length ? bridgeRouteSteps.totalCount : uniqueBridgeRouteSteps.length}
				getKey={(bridgeRouteStep) => bridgeRouteStep[EntityMetaKey.SelectorKey]}
				items={uniqueBridgeRouteSteps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No bridge route steps yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bridgeRouteStep }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BridgeRouteStep> })}
					<BridgeRouteStepView
						href={
							resolve('/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex=bridgeRouteStepIndex]', {
								fromChainId: String(bridgeRouteStep.entitySelector.$route.fromChainId),
								toChainId: String(bridgeRouteStep.entitySelector.$route.toChainId),
								fromToken: String(bridgeRouteStep.entitySelector.$route.fromToken),
								toToken: String(bridgeRouteStep.entitySelector.$route.toToken),
								fromAmount: String(bridgeRouteStep.entitySelector.$route.fromAmount),
								fromAddress: String(bridgeRouteStep.entitySelector.$route.fromAddress),
								slippage: String(bridgeRouteStep.entitySelector.$route.slippage),
								toAddress: String(bridgeRouteStep.entitySelector.$route.toAddress),
								stepIndex: String(bridgeRouteStep.entitySelector.indexInRoute),
							})
						}
						selection={select(EntityType.BridgeRouteStep, bridgeRouteStep.entitySelector)}
						prefetched={bridgeRouteStep}
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
		entityType={EntityType.BridgeRouteStep}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
