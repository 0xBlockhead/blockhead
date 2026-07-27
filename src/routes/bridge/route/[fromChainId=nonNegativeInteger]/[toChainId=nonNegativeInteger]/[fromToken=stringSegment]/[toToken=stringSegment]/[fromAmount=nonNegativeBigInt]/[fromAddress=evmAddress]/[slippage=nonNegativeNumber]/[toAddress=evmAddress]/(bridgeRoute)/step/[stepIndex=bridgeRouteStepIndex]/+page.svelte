<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
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


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteStepView from '$/views/BridgeRouteStepView.svelte'
</script>


<svelte:head>
	<title>{((String(pageSelection.entitySelector.indexInRoute ?? '') ? 'Step #' + String(pageSelection.entitySelector.indexInRoute ?? '') : '') || 'bridge route step')} • bridge route step • Blockhead</title>
</svelte:head>


<Page>
	<BridgeRouteStepView
		selection={pageSelection}
	/>
</Page>
