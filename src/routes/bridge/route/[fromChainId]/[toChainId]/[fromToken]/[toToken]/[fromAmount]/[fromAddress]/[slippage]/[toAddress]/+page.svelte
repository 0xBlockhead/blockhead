<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


<Page>
	<BridgeRouteView
		href={
			resolve('/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]', {
				fromChainId: params.fromChainId,
				toChainId: params.toChainId,
				fromToken: params.fromToken,
				toToken: params.toToken,
				fromAmount: params.fromAmount,
				fromAddress: params.fromAddress,
				slippage: params.slippage,
				toAddress: params.toAddress,
			})
		}
		selection={
			select(EntityType.BridgeRoute, {
				fromChainId: Number(params.fromChainId),
				toChainId: Number(params.toChainId),
				fromToken: decodeURIComponent(params.fromToken),
				toToken: decodeURIComponent(params.toToken),
				fromAmount: BigInt(params.fromAmount),
				fromAddress: decodeURIComponent(params.fromAddress),
				slippage: Number(params.slippage),
				toAddress: decodeURIComponent(params.toAddress),
			}, {
				sources: [
					Source.Lifi_Rest,
				],
				fields: {
					estimatedCostUsd: true,
					estimatedDurationSeconds: true,
					$fromNetwork: true,
					$toNetwork: true,
					toAmount: true,
					toAmountMin: true,
					tags: true,
				},
			})
		}
	/>
</Page>
