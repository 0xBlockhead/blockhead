<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Steps',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BridgeRouteStep> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BridgeRouteStep}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInRoute: true,
				tool: true,
				stepType: true,
			},
		})
	}
>
	{#snippet Item({ item: bridgeRouteStep })}
		{@const bridgeRouteStepSelector = bridgeRouteStep[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BridgeRouteStep}
			entitySelector={bridgeRouteStepSelector}
			href={
				resolve(
					'/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]',
					{
						fromChainId: String(bridgeRouteStepSelector.$route.fromChainId),
						toChainId: String(bridgeRouteStepSelector.$route.toChainId),
						fromToken: String(bridgeRouteStepSelector.$route.fromToken),
						toToken: String(bridgeRouteStepSelector.$route.toToken),
						fromAmount: String(bridgeRouteStepSelector.$route.fromAmount),
						fromAddress: String(bridgeRouteStepSelector.$route.fromAddress),
						slippage: String(bridgeRouteStepSelector.$route.slippage),
						toAddress: String(bridgeRouteStepSelector.$route.toAddress),
						stepIndex: String(bridgeRouteStepSelector.indexInRoute),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(bridgeRouteStepSelector.indexInRoute ?? '') ? 'Step #' + String(bridgeRouteStepSelector.indexInRoute ?? '') : '') || 'bridge route step'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(bridgeRouteStep.tool ?? ''), (bridgeRouteStep.stepType ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
