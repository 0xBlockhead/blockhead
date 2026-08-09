<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BridgeRoute> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BridgeRoute}
	bind:open
	resource={
		selection({
			...{
				fields: {
					fromChainId: true,
					toChainId: true,
					estimatedCostUsd: true,
					estimatedDurationSeconds: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bridgeRoute })}
		{@const bridgeRouteSelector = bridgeRoute[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BridgeRoute}
			entitySelector={bridgeRouteSelector}
			href={
				resolve(
					'/~/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]',
					{
						fromChainId: String(bridgeRouteSelector.fromChainId),
						toChainId: String(bridgeRouteSelector.toChainId),
						fromToken: bridgeRouteSelector.fromToken,
						toToken: bridgeRouteSelector.toToken,
						fromAmount: String(bridgeRouteSelector.fromAmount),
						fromAddress: bridgeRouteSelector.fromAddress,
						slippage: String(bridgeRouteSelector.slippage),
						toAddress: bridgeRouteSelector.toAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{[String(bridgeRouteSelector.fromChainId), 'to', String(bridgeRouteSelector.toChainId)].filter(Boolean).join(' ') || 'bridge route'}
			{/snippet}

			{#snippet Value()}
				LI.FI quote
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String(bridgeRoute.estimatedCostUsd), String(bridgeRoute.estimatedDurationSeconds)].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
