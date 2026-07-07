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
	import BridgeRouteStepView from '$/views/BridgeRouteStepView.svelte'
</script>


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
			select(EntityType.BridgeRouteStep, {
				$route: {
					fromChainId: Number(params.fromChainId),
					toChainId: Number(params.toChainId),
					fromToken: decodeURIComponent(params.fromToken),
					toToken: decodeURIComponent(params.toToken),
					fromAmount: BigInt(params.fromAmount),
					fromAddress: decodeURIComponent(params.fromAddress),
					slippage: Number(params.slippage),
					toAddress: decodeURIComponent(params.toAddress),
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
			})
		}
	/>
</Page>
