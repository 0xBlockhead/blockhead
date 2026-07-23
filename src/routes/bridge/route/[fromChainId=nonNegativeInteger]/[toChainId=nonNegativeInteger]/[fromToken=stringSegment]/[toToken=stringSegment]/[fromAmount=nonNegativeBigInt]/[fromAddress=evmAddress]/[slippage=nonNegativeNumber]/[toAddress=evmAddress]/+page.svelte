<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { bridgeRouteTagByTag } from '$/constants/Bridge.ts'
	import { BridgeRouteTag } from '$/schema/BridgeRoute.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BridgeRoute, data.selector, {
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.fromChainId) ?? ''), 'to', String((data.selector.toChainId) ?? '')].filter(Boolean).join(' ') || 'bridge route' : [String((({ ...data.selector, ...pageSelection.entity }).fromChainId) ?? ''), 'to', String((({ ...data.selector, ...pageSelection.entity }).toChainId) ?? '')].filter(Boolean).join(' ') || 'bridge route'))} • bridge route • Blockhead</title>
</svelte:head>


<Page>
	<BridgeRouteView
		href={
			resolve('/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', {
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
		selection={pageSelection}
	/>
</Page>
