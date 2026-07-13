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
		placeholderText,
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
			selection({
				fields: {
					indexInRoute: true,
					tool: true,
					stepType: true,
					$route: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={bridgeRouteSteps.totalCount}
				getKey={(bridgeRouteStep) => bridgeRouteStep[EntityMetaKey.SelectorKey]}
				items={uniqueBridgeRouteSteps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bridge route steps yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bridgeRouteStep }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BridgeRouteStep> })}
					{@const bridgeRouteStepFields = { ...bridgeRouteStep[EntityMetaKey.Selector], ...bridgeRouteStep }}
					{@const bridgeRouteStepHrefFields = { ...bridgeRouteStep, ...bridgeRouteStep[EntityMetaKey.Selector] }}
					<BridgeRouteStepView
						selection={select(EntityType.BridgeRouteStep, bridgeRouteStep[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={bridgeRouteStepFields}
						href={
							(bridgeRouteStepHrefFields.indexInRoute !== undefined && bridgeRouteStepHrefFields.$route !== undefined && bridgeRouteStepHrefFields.$route.fromChainId !== undefined && bridgeRouteStepHrefFields.$route.toChainId !== undefined && bridgeRouteStepHrefFields.$route.fromToken !== undefined && bridgeRouteStepHrefFields.$route.toToken !== undefined && bridgeRouteStepHrefFields.$route.fromAmount !== undefined && bridgeRouteStepHrefFields.$route.fromAddress !== undefined && bridgeRouteStepHrefFields.$route.slippage !== undefined && bridgeRouteStepHrefFields.$route.toAddress !== undefined ? resolve('/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/step/[stepIndex=bridgeRouteStepIndex]', {
								stepIndex: String(bridgeRouteStepHrefFields.indexInRoute ?? ''),
								fromChainId: String(bridgeRouteStepHrefFields.$route.fromChainId ?? ''),
								toChainId: String(bridgeRouteStepHrefFields.$route.toChainId ?? ''),
								fromToken: String(bridgeRouteStepHrefFields.$route.fromToken ?? ''),
								toToken: String(bridgeRouteStepHrefFields.$route.toToken ?? ''),
								fromAmount: String(bridgeRouteStepHrefFields.$route.fromAmount ?? ''),
								fromAddress: String(bridgeRouteStepHrefFields.$route.fromAddress ?? ''),
								slippage: String(bridgeRouteStepHrefFields.$route.slippage ?? ''),
								toAddress: String(bridgeRouteStepHrefFields.$route.toAddress ?? ''),
							}) : undefined)
						}
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
