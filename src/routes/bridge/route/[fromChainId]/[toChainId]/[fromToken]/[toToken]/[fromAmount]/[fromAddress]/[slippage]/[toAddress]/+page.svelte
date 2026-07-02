<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


<svelte:head>
	<title>bridge route • Blockhead</title>
</svelte:head>


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
			select(EntityType.BridgeRoute, data.selector, {
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
