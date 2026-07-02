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
	import BridgeRouteStepView from '$/views/BridgeRouteStepView.svelte'
</script>


<svelte:head>
	<title>bridge route step • Blockhead</title>
</svelte:head>


<Page>
	<BridgeRouteStepView
		href={
			resolve('/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex=bridgeRouteStepIndex]', {
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
		selection={
			select(EntityType.BridgeRouteStep, data.selector, {
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
			})
		}
	/>
</Page>
