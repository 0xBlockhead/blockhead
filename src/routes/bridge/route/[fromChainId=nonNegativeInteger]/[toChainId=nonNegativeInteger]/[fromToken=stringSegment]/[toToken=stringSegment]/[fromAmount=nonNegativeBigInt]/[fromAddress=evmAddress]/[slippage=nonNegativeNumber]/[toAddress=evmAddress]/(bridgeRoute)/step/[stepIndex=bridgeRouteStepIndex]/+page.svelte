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

	const pageSelection = $derived(select(EntityType.BridgeRouteStep, {
		$route: {
			fromChainId: Number(params.fromChainId),
			toChainId: Number(params.toChainId),
			fromToken: params.fromToken,
			toToken: params.toToken,
			fromAmount: BigInt(params.fromAmount),
			fromAddress: params.fromAddress,
			slippage: Number(params.slippage),
			toAddress: params.toAddress,
		},
		indexInRoute: Number(params.stepIndex),
	}, {
		sources: [
			Source.Lifi_Rest,
		],
		fields: {
			tool: true,
			stepType: true,
			$fromNetwork: true,
			$toNetwork: true,
			$fromToken: true,
			$toToken: true,
			railId: true,
			settlementModel: true,
			verificationModel: true,
			assetOutcome: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInRoute) ?? '') ? 'Step #' + String((pageSelection.entitySelector.indexInRoute) ?? '') : '') || 'bridge route step' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInRoute) ?? '') ? 'Step #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInRoute) ?? '') : '') || 'bridge route step'))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteStepView from '$/views/BridgeRouteStepView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • bridge route step • Blockhead</title>
</svelte:head>


<Page>
	<BridgeRouteStepView
		href={
			resolve('/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/step/[stepIndex=bridgeRouteStepIndex]', {
				fromChainId: params.fromChainId,
				toChainId: params.toChainId,
				fromToken: params.fromToken,
				toToken: params.toToken,
				fromAmount: params.fromAmount,
				fromAddress: params.fromAddress,
				slippage: params.slippage,
				toAddress: params.toAddress,
				stepIndex: params.stepIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
