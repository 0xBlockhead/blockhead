<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


{#key [params.fromChainId, params.toChainId, params.fromToken, params.toToken, params.fromAmount, params.fromAddress, params.slippage, params.toAddress].join(':')}
	<ParentPageCollapsible
		href={
			resolve(
				'/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]',
				{
					fromChainId: params.fromChainId,
					toChainId: params.toChainId,
					fromToken: params.fromToken,
					toToken: params.toToken,
					fromAmount: params.fromAmount,
					fromAddress: params.fromAddress,
					slippage: params.slippage,
					toAddress: params.toAddress,
				}
			)
		}
	>
		{#snippet Summary()}
			<BridgeRouteView
				selection={
					select(EntityType.BridgeRoute, data.selector, { sources: [
						Source.Lifi_Rest,
					] })
				}
				href={
					resolve(
						'/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]',
						{
							fromChainId: params.fromChainId,
							toChainId: params.toChainId,
							fromToken: params.fromToken,
							toToken: params.toToken,
							fromAmount: params.fromAmount,
							fromAddress: params.fromAddress,
							slippage: params.slippage,
							toAddress: params.toAddress,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
