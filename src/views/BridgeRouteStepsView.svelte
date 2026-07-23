<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		title = 'Steps',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BridgeRouteSteps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BridgeRouteStep>
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
	entityType={EntityType.BridgeRouteStep}
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
				indexInRoute: true,
				tool: true,
				stepType: true,
				$route: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bridgeRouteSteps) => [...new Map(bridgeRouteSteps.values.map((bridgeRouteStep) => [bridgeRouteStep[EntityMetaKey.SelectorKey], bridgeRouteStep])).values()]}
	getKey={(bridgeRouteStep) => bridgeRouteStep[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bridge route steps yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bridgeRouteStep })}
		{@const bridgeRouteStepFields = { ...bridgeRouteStep[EntityMetaKey.Selector], ...bridgeRouteStep }}
		<EntityView
			entityType={EntityType.BridgeRouteStep}
			entitySelector={bridgeRouteStep[EntityMetaKey.Selector]}
			href={
				(
					bridgeRouteStep[EntityMetaKey.Selector] != null && 'indexInRoute' in bridgeRouteStep[EntityMetaKey.Selector]
					&& bridgeRouteStep[EntityMetaKey.Selector].indexInRoute != null
					&& bridgeRouteStep[EntityMetaKey.Selector] != null && '$route' in bridgeRouteStep[EntityMetaKey.Selector]
					&& bridgeRouteStep[EntityMetaKey.Selector].$route != null && 'fromChainId' in bridgeRouteStep[EntityMetaKey.Selector].$route
					&& bridgeRouteStep[EntityMetaKey.Selector].$route.fromChainId != null
					&& bridgeRouteStep[EntityMetaKey.Selector].$route != null && 'toChainId' in bridgeRouteStep[EntityMetaKey.Selector].$route
					&& bridgeRouteStep[EntityMetaKey.Selector].$route.toChainId != null
					&& bridgeRouteStep[EntityMetaKey.Selector].$route != null && 'fromToken' in bridgeRouteStep[EntityMetaKey.Selector].$route
					&& bridgeRouteStep[EntityMetaKey.Selector].$route.fromToken != null
					&& bridgeRouteStep[EntityMetaKey.Selector].$route != null && 'toToken' in bridgeRouteStep[EntityMetaKey.Selector].$route
					&& bridgeRouteStep[EntityMetaKey.Selector].$route.toToken != null
					&& bridgeRouteStep[EntityMetaKey.Selector].$route != null && 'fromAmount' in bridgeRouteStep[EntityMetaKey.Selector].$route
					&& bridgeRouteStep[EntityMetaKey.Selector].$route.fromAmount != null
					&& bridgeRouteStep[EntityMetaKey.Selector].$route != null && 'fromAddress' in bridgeRouteStep[EntityMetaKey.Selector].$route
					&& bridgeRouteStep[EntityMetaKey.Selector].$route.fromAddress != null
					&& bridgeRouteStep[EntityMetaKey.Selector].$route != null && 'slippage' in bridgeRouteStep[EntityMetaKey.Selector].$route
					&& bridgeRouteStep[EntityMetaKey.Selector].$route.slippage != null
					&& bridgeRouteStep[EntityMetaKey.Selector].$route != null && 'toAddress' in bridgeRouteStep[EntityMetaKey.Selector].$route
					&& bridgeRouteStep[EntityMetaKey.Selector].$route.toAddress != null ?
						resolve('/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/step/[stepIndex=bridgeRouteStepIndex]', {
					stepIndex: String(bridgeRouteStep[EntityMetaKey.Selector].indexInRoute ?? ''),
					fromChainId: String(bridgeRouteStep[EntityMetaKey.Selector].$route.fromChainId ?? ''),
					toChainId: String(bridgeRouteStep[EntityMetaKey.Selector].$route.toChainId ?? ''),
					fromToken: String(bridgeRouteStep[EntityMetaKey.Selector].$route.fromToken ?? ''),
					toToken: String(bridgeRouteStep[EntityMetaKey.Selector].$route.toToken ?? ''),
					fromAmount: String(bridgeRouteStep[EntityMetaKey.Selector].$route.fromAmount ?? ''),
					fromAddress: String(bridgeRouteStep[EntityMetaKey.Selector].$route.fromAddress ?? ''),
					slippage: String(bridgeRouteStep[EntityMetaKey.Selector].$route.slippage ?? ''),
					toAddress: String(bridgeRouteStep[EntityMetaKey.Selector].$route.toAddress ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{(String((bridgeRouteStepFields.indexInRoute) ?? '') ? 'Step #' + String((bridgeRouteStepFields.indexInRoute) ?? '') : '') || 'bridge route step'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((bridgeRouteStepFields.tool) ?? ''), String((bridgeRouteStepFields.stepType) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
